import fs from "fs";
import path from "path";
import __dirname from "../dirname.js";

class Logger {
    constructor() {
        this.levels = ["debug", "info", "warn", "error"];
        this.currentLevel = process.env.LOG_LEVEL || "debug";

        // Log directory + file
        this.logDir = path.join(__dirname, "logs");
        this.logFile = path.join(this.logDir, "app.log");

        // Ensure logs directory exists
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    setLevel(level) {
        if (this.levels.includes(level)) {
            this.currentLevel = level;
        }
    }

    shouldLog(type) {
        return (
            this.levels.indexOf(type) >= this.levels.indexOf(this.currentLevel)
        );
    }

    formatMessage(type, args) {
        const timestamp = new Date().toISOString();
        return `[${type.toUpperCase()}] ${timestamp}: ${args.map(a =>
            typeof a === "object" ? JSON.stringify(a) : a
        ).join(" ")}\n`;
    }

    writeToFile(message) {
        try {
            fs.appendFileSync(this.logFile, message);
        } catch (e) {
            console.error("Logger file write error:", e);
        }
    }

    log(type, ...args) {
        if (!this.shouldLog(type)) return;

        const formatted = this.formatMessage(type, args);

        // Console logging
        if (type === "error") console.error(formatted.trim());
        else if (type === "warn") console.warn(formatted.trim());
        else if (type === "info") console.info(formatted.trim());
        else console.debug(formatted.trim());

        // File logging
        this.writeToFile(formatted);
    }

    debug(...args) { this.log("debug", ...args); }
    info(...args) { this.log("info", ...args); }
    warn(...args) { this.log("warn", ...args); }
    error(...args) { this.log("error", ...args); }
}

const logger = new Logger();
export default logger;
