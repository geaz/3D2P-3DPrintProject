# 3D2P - 3D Print Project

The **3D2P** desktop application is a CLI which includes functionalities to open, view and create **3MF files**.

In contrast to other 3MF applications the CLI is able to add readme files to a 3MF in a specification compliant way. Every 3MF file created by 3D2P is a **valid 3MF file**! 
This way you are able to package your **complete 3D print project into a single file**.

To download the application go to the [release page](https://github.com/geaz/3D2P-3DPrintProject/releases) or try [the viewer online](https://3d2p.net). There is also a [Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=3d2p.vscode) available, to make the creation of 3D2P files easier.

Please head over to the [Application](https://3d2p.net/Application) page, for **two small videos**.

![Application](https://github.com/geaz/3D2P-3DPrintProject/raw/feature-cli/src/web/wwwroot/videos/app-poster.png)

## Development

This section will give a brief overview of the repository code/folder structure and which technologies and frameworks were used. Hopefully this will help potential contributers.

### Get started

Clone the repository and make sure that you have **.net core**, **npm** and **yarn** installed. The repository uses a *yarn workspace*. Run **yarn install** in the root folder of the repository to install the dependencies of all projects.

After *yarn* ran successfully, open the *3D2P.code-workspace* file in Visual Studio Code.

### app

This folder contains the main application and components. The STL viewer components and applications (Web, Desktop and Visual Studio Code) are written in *Typescript*. All components are implemented as [React](https://reactjs.org/) functional components.

The folder contains three webpack files to create the application packages for the different platforms. The Web and Desktop application are using the same *PrintProjectApp* (PrintProjectApp.tsx). Visual Studio Code only uses parts of the main application. Thats why it got its own *StlViewer* (StlViewer.vscode.tsx).

### desktop

The desktop folder contains a *.net core* console application. It implements the CLI commands and uses [SharpWebview](https://github.com/geaz/sharpWebview) to interface the available web browser on the running system. The application **does not use electron**!

Make sure to run *npm run build:desktop* in the *app* folder before you try to run the desktop application (*dotnet run*). The npm task will package the Typescript application and copies it into the *app* folder of the dektop application.

### vscode

The Visual Studio Code extension uses the installed 3D2P CLI on the system. It provides common commands to manage and create 3D2P files and 3MF files.

The extension implements all its commands through the included *commandEngine*. Have a look into the [AddStlCommand.ts](https://github.com/geaz/3D2P-3DPrintProject/blob/feature-cli/src/vscode/src/vsc/commands/AddStlCommand.ts) for an example how a command is implemented. 

To run/debug it, simply select the *Run VSCode Extension* task in the *debug view* of Visual Studio Code and run it.

### web

The website is a *ASP.net core* application. It is pretty basic and interfaces the same *react* components as the desktop application. Make sure to run *npm run build:web* in the *app* folder before you try to run the web application (*dotnet run*). You can also use *npm run dev* in the web folder to run sass and .net core in *watch mode*.

Add the following environment variables to your system:

```
export PRINTPROJECT_EXTRACTION_TARGET_PATH='PATH_TO_PROJECTS_EXTRACTION_FOLDER'
```

## Credits

The icons used in the Visual Studio Code Extension are taken from [Freepik](https://www.flaticon.com/) and [Icons8](https://icons8.com/)