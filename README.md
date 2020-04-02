# 3D2P - 3D Print Projects

[TODO]

## Code Structure

This section will give a brief overview of the repository code/folder structure and which technologies and frameworks were used.
Hopefully this will help potential contributers.

### Used Framworks / Technologies

[ASP.NET Core Razor Pages](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-3.1), C#, [Typescript](https://www.typescriptlang.org/), [Preact](https://preactjs.com/), [HTM - HTML templates](https://github.com/developit/htm), [Emotion - CSS](https://emotion.sh), Node.js, NPM

### components

This folder contains all [preact](https://preactjs.com/) components used by the **vscode extension** and the **website**.
It is designed as a local NPM package. This way the **vscode extension** and the **website** are able to share some *preact* components.

The package includes three major components:

- **ConfigComponent.ts**
- **StlViewerComponent.ts**
- **AnnotationsComponent.ts** *uses the AnnotationItemComponent as a subcomponent*

### vscode

[TODO]

### web

[TODO]

## Development Build Instructions

To get a consistent build, all build tasks are designed as npm scripts.

### VS Code Extension

The **vscode** folder contains the whole code for the Visual Studio Code Extension. The following steps are needed to get it running:

1. Execute *'npm install'* inside the **components** and **vscode** folder.
2. Execute *'npm run compile:apps'* inside the **vscode** folder.
3. Open the **vscode** folder in Visual Studio Code and press *F5* to run and debug the extension in a new VS Code instance.

### Server

The **web** folder contains the code for the *webapi* and the *homepage* of **3D2P**. The following steps are needed to get it running:

1. Execute *'npm install'* inside the **web** folder.
2. Execute *'npm run dev'* - this starts a development server and starts watching for scss and c# file changes

## Credits

The icons used in the Visual Studio Code Extension are taken from [Freepik](https://www.flaticon.com/) and [Icons8](https://icons8.com/)

## TODOs

- Search
- Extension Lending Page

- Delete Command in VS Code
- VS Code Gallery functionality

- Refactoring and Documentation

- Finish Readme