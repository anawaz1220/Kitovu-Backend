class Logger {
    static error(message, error) {
      console.error(`[ERROR] ${message}:`, {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  
    static info(message, data = {}) {
      console.log(`[INFO] ${message}:`, {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  module.exports = Logger;