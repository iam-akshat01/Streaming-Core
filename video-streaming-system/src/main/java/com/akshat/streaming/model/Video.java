public class Video {
    private int videoId;
    private String description;
    private String title;
    private String url;
    private String creator;
    private double duration; 
    private double size;     

    public Video(int videoId, String description, String title, String url, String creator, double duration, double size) {
        this.videoId = videoId;
        this.description = description;
        this.title = title;
        this.url = url;
        this.creator = creator;
        this.duration = duration;
        this.size = size;
    }

    public int getVideoId() {
        return videoId;
    }

    public String getDescription() {
        return description;
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }

    public String getCreator() {
        return creator;
    }

    public double getDuration() {
        return duration;
    }

    public double getSize() {
        return size;
    }

    @Override
    public String toString() {
        return videoId + "," + title + "," + description + "," + url + "," + creator + "," + duration + "," + size;
    }
}