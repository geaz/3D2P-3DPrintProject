import * as commandExists from "command-exists";
import { spawn } from "child_process";

import { IEvent, Event } from "./Event";
import { getOutputChannel } from "./vsc/OutputChannel";
import { StlAnnotation } from "3d2p-react-app";

const cliFileName = "3D2P";

export class PrintProjectCli {
    public async cliExists(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            commandExists(cliFileName, function (err, commandExists) {
                resolve(commandExists);
            });
        });
    }

    public async open3mf(filePath: string): Promise<boolean> {
        return await this.execute([filePath]);
    }

    public async createProject(dir: string, overwrite: boolean): Promise<boolean> {
        let params = ["create", "--dir", dir];
        if (overwrite) params.push("--overwrite");

        return await this.execute(params);
    }

    public async addStl(projectPath: string, stlPath: string, status: string): Promise<boolean> {
        let params = ["add", "--project", projectPath, "--stl", stlPath, "--status", status];
        return await this.execute(params);
    }

    public async packProject(projectPath: string, dir: string): Promise<boolean> {
        let params = ["pack", "--project", projectPath, "--dir", dir, "--overwrite"];
        return await this.execute(params);
    }

    public async setStlAnnotations(projectPath: string, stlName: string, annotations: Array<StlAnnotation>): Promise<boolean> {
        let params = [
            "set", 
            "annotations", 
            "--project", projectPath, 
            "--stl-name", stlName,
            "--annotations", JSON.stringify(annotations)];
        return await this.execute(params);
    }

    public async setStlInfo(projectPath: string, stlName: string, status?: string, color?: string): Promise<boolean> {
        let params = ["set", "stl", "--project", projectPath, "--stl-name", stlName];
        if (status) {
            params.push("--status");
            params.push(status);
        }
        if (color) {
            params.push("--color");
            params.push(color);
        }
        return await this.execute(params);
    }

    public async setProjectData(
        projectPath: string,
        name?: string,
        status?: string,
        thumbnailFilePath?: string,
        readmeFilePath?: string
    ): Promise<boolean> {
        let params = ["set", "project", "--project", projectPath];
        if (name) {
            params.push("--name");
            params.push(name);
        }
        if (status) {
            params.push("--status");
            params.push(status);
        }
        if (thumbnailFilePath) {
            params.push("--thumbnail");
            params.push(thumbnailFilePath);
        }
        if (readmeFilePath) {
            params.push("--readme");
            params.push(readmeFilePath);
        }
        return await this.execute(params);
    }

    private execute(args: string[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            getOutputChannel().appendLine(`Executing: ${cliFileName} ${args.join(" ")}`);
            getOutputChannel().appendLine(""); 
             
            let process = spawn(cliFileName, args, {});
            process.on("close", (code) => {
                resolve(code === 0);
            });
            process.on("error", (error) => {
                reject(error);
            });
            process.stderr.on("data", (data) => this.outputCliData(data));
            process.stdout.on("data", (data) => this.outputCliData(data));
        });
    }

    private outputCliData(data: string): void {
        data.toString()
            .split("\r\n")
            .map((line: string) => {
                if (line !== "") {
                    this._onCliProgress.trigger(line);
                    getOutputChannel().appendLine(line);
                }
            });
    }

    private _onCliProgress: Event<string> = new Event<string>();
    get onCliProgress(): IEvent<string> {
        return this._onCliProgress.expose();
    }
}
