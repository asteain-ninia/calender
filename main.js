//参考；https://ics.media/entry/7298/
	// アプリケーション作成用のモジュールを読み込み
	const {app, BrowserWindow,ipcMain, ipcRenderer} = require('electron');
	const Path = require("path");
	const fs = require("fs");	

	// メインウィンドウ
	let mainWindow;

	function createWindow() {
		// メインウィンドウを作成します
		mainWindow = new BrowserWindow({
			webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			//preload: Path.join(app.getAppPath(), "/preload.js")
			preload: __dirname+"/preload.js"
			},
			width: 800, height: 600,
		});

		// メインウィンドウに表示するURLを指定します
		mainWindow.loadFile('core.html');
	
		// デベロッパーツールの起動
		mainWindow.webContents.openDevTools();

		// メインウィンドウが閉じられたときの処理
		mainWindow.on('closed', () => {
			mainWindow = null;
			}
		);
	}

	ipcMain.on("test",function(event,args){
		console.log("pong! and "+ args);
		event.reply("receive","メインよりレンダラへ")
	}
	
	)
	//以下おまじないみたいなやつ

	//  初期化が完了した時の処理
	app.on('ready', createWindow);

	// 全てのウィンドウが閉じたときの処理
	app.on('window-all-closed', () => {
	// macOSのとき以外はアプリケーションを終了させます
	if (process.platform !== 'darwin') {
		app.quit();
	}
	});
	// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
	app.on('activate', () => {
	// メインウィンドウが消えている場合は再度メインウィンドウを作成する
	if (mainWindow === null) {
		createWindow();
	}
	});