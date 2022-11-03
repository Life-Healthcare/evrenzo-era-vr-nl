type SessionPage = {
    start: Date | string;
    end: Date | string;
    duration: number;
    name: string;
  };
  
  type SessionData = {
    uuid: string;
    start: Date | string;
    end: Date | string;
    duration: number;
    pages: SessionPage[];
    sendingToServer: boolean;
    sentToServer: boolean;
  };
  
  class SessionManager {
    private serverEndpoint = "https://analytics-server.finervision.com/api/save-sessions";
  
    private cacheKeyPrefix = "evrenzo-era-vr-nl";
  
    private projectId = "evrenzo-era-vr-nl";
  
    private readonly deviceId;
  
    constructor() {
      const key = `${this.cacheKeyPrefix}.deviceId`;
      this.deviceId = localStorage.getItem(key) ?? this.uuid();
      localStorage.setItem(key, this.deviceId);
    }
  
    private currentSession: SessionData | null = null;
  
    private static getTimestamp(date: Date): string {
      const offset = date.getTimezoneOffset();
      const utcDate = new Date(date.getTime() - offset * 60 * 1000);
      let [dateString, timeString] = utcDate.toISOString().split("T");
      timeString = timeString.split(".")[0];
      return `${dateString} ${timeString}`;
    }
  
    private save(session: SessionData) {
      const sessions = JSON.parse(
        localStorage.getItem(`${this.cacheKeyPrefix}.sessions`) ?? "[]"
      );
      sessions.push(session);
      localStorage.setItem(
        `${this.cacheKeyPrefix}.sessions`,
        JSON.stringify(sessions)
      );
    }
  
    private getSaved(): SessionData[] {
      return JSON.parse(
        localStorage.getItem(`${this.cacheKeyPrefix}.sessions`) ?? "[]"
      );
    }
  
    private uuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  
    async sendToServer() {
      // Update server sending state
      const sessions = this.getSaved()
        .filter((session) => !session.sendingToServer && !session.sentToServer)
        .map((session) => {
          session.sendingToServer = true;
          return session;
        });
      let sentToServer = false;
      try {
        const res = await fetch(this.serverEndpoint, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            deviceId: this.deviceId,
            projectId: this.projectId,
            sessions,
          }),
        });
        sentToServer = res.ok;
      } catch (err) {
        console.error(err);
      } finally {
        // Update server send states
        const sessionUuids = sessions.map((session) => session.uuid);
        const updatedSessions = this.getSaved().map((session) => {
          if (sessionUuids.includes(session.uuid)) {
            session.sendingToServer = false;
            session.sentToServer = sentToServer;
          }
          return session;
        });
        localStorage.setItem(
          `${this.cacheKeyPrefix}.sessions`,
          JSON.stringify(updatedSessions)
        );
      }
    }
  
    start() {
      if (this.currentSession !== null) {
        this.end();
      }
      this.currentSession = {
        uuid: this.uuid(),
        start: new Date(),
        end: new Date(),
        duration: 0,
        pages: [],
        sendingToServer: false,
        sentToServer: false,
      };
    }
  
    page(name: SessionPage["name"]) {
      if (this.currentSession === null) {
        console.warn("You must have a session set before calling `page`");
        return;
      }
  
      // Set duration for previous page
      const prevPageIndex = this.currentSession.pages.length - 1;
      if (prevPageIndex > -1) {
        this.currentSession.pages[prevPageIndex].end = new Date();
      }
  
      this.currentSession.pages.push({
        start: new Date(),
        end: new Date(),
        duration: 0,
        name,
      });
    }
  
    end() {
      if (this.currentSession === null) {
        console.warn("You must have a session set before calling `end`");
        return;
      }
  
      // Format session dates and add duration
      this.currentSession.end = new Date();
      const start = this.currentSession.start as Date;
      const end = this.currentSession.end as Date;
      this.currentSession.start = SessionManager.getTimestamp(start);
      this.currentSession.end = SessionManager.getTimestamp(end);
      this.currentSession.duration = end.getTime() - start.getTime();
  
      // Update last page index end time
      const lastPageIndex = this.currentSession.pages.length - 1;
      if (lastPageIndex > -1) {
        this.currentSession.pages[lastPageIndex].end = new Date();
      }
  
      // Format session page dates and add durations
      this.currentSession.pages.map((page) => {
        const start = page.start as Date;
        let end = page.end as Date;
        page.duration = end.getTime() - start.getTime();
        page.start = SessionManager.getTimestamp(start);
        page.end = SessionManager.getTimestamp(end);
        return page;
      });
  
      this.save(this.currentSession);
      this.currentSession = null;
    }
  }
  
  const sessionManager = new SessionManager();
  
  export default sessionManager;