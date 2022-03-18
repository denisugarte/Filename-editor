const { app, BrowserWindow, dialog, ipcMain, screen } = require('electron')
const path = require('path')
const fs = require("fs")

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 750,
        title: "Fitxategien izen-editorea",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    ipcMain.handle("select_directory", async (event, arg) => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ["openDirectory"],
        })

        return result.filePaths
    })
    ipcMain.handle("rename_images", async (event, args) => {
        const errorMessage = ""
        const executionError = false
        const directory = args[0]
        const prefix = args[1]
        fs.readdir(directory, (error, files) => {
            if (error) {
                executionError = true
                errorMessage = error
            }
            else {
                files.forEach(file => {
                    fs.stat(path.join(directory, file), (error, stats) => {
                        if (error) {
                            executionError = true
                            errorMessage = error
                        }
                        else {
                            if (stats.isFile()) {
                                const newFileName = prefix + "_" + file.replaceAll(" ", "_")
                                fs.rename(path.join(directory, file), path.join(directory, newFileName), (error) => {
                                    if (error) {
                                        executionError = true
                                        errorMessage = error
                                    }
                                })
                            }
                        }
                    })
                })
            }
        })

        if (executionError) {
            return[-1, errorMessage]
        }
        else {
            return [0, errorMessage]
        }
    })
    ipcMain.handle("rename_captures", async (event, args) => {
        const errorMessage = ""
        const executionError = false
        const directory = args[0]
        const prefix = args[1]
        const nameStructure = args[2]
        
        try {
            const files = fs.readdirSync(directory)
            files.forEach((file, i) => {
                const fileStatistics = fs.statSync(path.join(directory, file))
                if (fileStatistics.isFile()) {
                    const newFileName = prefix + "_" + nameStructure + "_" + (i + 1).toString() + path.extname(file)
                    fs.renameSync(path.join(directory, file), path.join(directory, newFileName))
                }
            })
        }
        catch (error) {
            errorMessage = error
            executionError = true
        }

        if (executionError)
            return[-1, errorMessage]
        else
            return [0, ""]
    })

    mainWindow.removeMenu()
    mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
