# 3D2P - 3D Print Projects

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