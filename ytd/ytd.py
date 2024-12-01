from abc import ABC, abstractmethod

class YouTubeDownloaderInterface(ABC):
    @abstractmethod
    def downloadAudioFiles(self, url: str, destination: str) -> None:
        """Downloads an audio file from YouTube from the specified URL to the given destination."""
        pass
    
    @abstractmethod
    def downloadVideoFiles(self, url: str, destination: str) -> None:
        """Downloads a video file from YouTube from the specified URL to the given destination."""
        pass

    @abstractmethod
    def downloadAudioPlaylist(self, url: str, destination: str) -> list:
        """Downloads a Youtube playlist as audio files."""
        pass

    @abstractmethod
    def downloadVideoPlaylist(self, url: str, destination: str) -> list:
        """Downloads a Youtube playlist as video files."""
        pass

