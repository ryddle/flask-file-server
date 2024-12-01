import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import ttk
from YtdlpYtd import YtdlpYtd

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("YouTube Downloader")
        self.geometry("500x480")
        self.resizable(False, False)

        self.type_var = tk.StringVar()
        self.type_var.set("audio")
        
        tk.Label(self, text="").pack()

        self.type_frame = tk.Frame(self)
        self.type_frame.pack(anchor="w", padx=50)
        tk.Label(self.type_frame, text="Select type:").pack(side="left")
        tk.Radiobutton(self.type_frame, text="Audio", variable=self.type_var, value="audio").pack(side="left")
        tk.Radiobutton(self.type_frame, text="Video", variable=self.type_var, value="video").pack(side="left")

        """tk.Label(self, text="").pack()
        
        folder_frame = tk.Frame(self)
        folder_frame.pack(fill="x", padx=50)
        tk.Label(folder_frame, text="Select Output Folder:").pack(side="left")
        self.output_folder = tk.Entry(folder_frame, width=38)
        self.output_folder.pack(side="left")
        tk.Button(folder_frame, text="Browse", command=self.browse_folder).pack(side="right") """

        tk.Label(self, text="").pack()

        tk.Label(self, text="Paste YouTube URLs:", anchor="w", padx=50).pack(fill="x")
        self.urls_textarea = tk.Text(self, height=10, width=50)
        self.urls_textarea.insert("1.0", "https://www.youtube.com/watch?v=_Drfcw8f3Bs")        
        self.urls_textarea.pack()
        tk.Label(self, text="").pack()
        tk.Button(self, text="Download videos", command=self.download_files).pack()
        
        tk.Label(self, text="").pack()
        
        tk.Label(self, text="Enter playlist URL:", anchor="w", padx=50).pack(fill="x")
        self.playlist_entry = tk.Entry(self, width=66)
        self.playlist_entry.pack()
        tk.Label(self, text="").pack()
        tk.Button(self, text="Download playlist", command=self.download_playlist).pack()
        
        tk.Label(self, text="").pack()
        self.loader = ttk.Progressbar(self, orient="horizontal", length=400, mode="indeterminate")
        self.loader.pack_forget()

    """ def browse_folder(self):
        folder_selected = filedialog.askdirectory()
        if folder_selected:
            self.output_folder.delete(0, tk.END)
            self.output_folder.insert(tk.END, folder_selected) """


    def download_files(self):
        urls = self.urls_textarea.get("1.0", "end-1c").splitlines()
        if not urls:
            messagebox.showerror("Error", "No URLs entered")
            return
        destination = filedialog.askdirectory()
        if not destination:
            return
        ytd = YtdlpYtd("")
        self.loader.pack()
        self.loader.start()
        self.update()
        if self.type_var.get() == "audio":
            filesObj, errors = ytd.downloadAudioFiles(urls, destination)
            self.loader.stop()
            self.loader.pack_forget()
        else:
            filesObj, errors = ytd.downloadVideoFiles(urls, destination)
            self.loader.stop()
            self.loader.pack_forget()

    def download_playlist(self):
        playlist_url = self.playlist_entry.get()
        if not playlist_url:
            messagebox.showerror("Error", "No playlist URL entered")
            return
        destination = filedialog.askdirectory()
        if not destination:
            return
        ytd = YtdlpYtd(playlist_url)
        self.loader.pack()
        self.loader.start()
        if self.type_var.get() == "audio":
            filesObj, errors = ytd.downloadAudioPlaylist(playlist_url, destination)
            self.loader.stop()
            self.loader.pack_forget()
        else:
            filesObj, errors = ytd.downloadVideoPlaylist(playlist_url, destination)
            self.loader.stop()
            self.loader.pack_forget()


if __name__ == "__main__":
    app = App()
    app.mainloop()
