// 阅读进度存储管理
export class ReadingProgress {
    static STORAGE_KEY = 'foliate-reading-progress';

    static getBookId(book) {
        console.log(book, 'book');
        // 根据书籍元数据生成唯一ID
        const { title, author } = book.metadata || {};
        return `${title}-${author}`.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    }

    static getStoredData() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        } catch {
            return {};
        }
    }

    static setStoredData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Failed to save reading progress:', e);
            return false;
        }
    }

    static saveProgress(book, progress) {
        const bookId = this.getBookId(book);
        const stored = this.getStoredData();
        console.log(book, 'book', 'progress', progress, bookId, stored);
        
        stored[bookId] = {
            lastRead: new Date().toISOString(),
            metadata: {
                title: book.metadata?.title,
                author: book.metadata?.author
            },
            progress: {
                index: progress.section?.current,
                fraction: progress.fraction,
                location: progress.location?.current
            }
        };

        return this.setStoredData(stored);
    }

    static getProgress(book) {
        const bookId = this.getBookId(book);
        const stored = this.getStoredData();
        return stored[bookId]?.progress;
    }

    static getRecentBooks(limit = 10) {
        const stored = this.getStoredData();
        return Object.entries(stored)
            .sort(([, a], [, b]) => new Date(b.lastRead) - new Date(a.lastRead))
            .slice(0, limit)
            .map(([, data]) => data.metadata);
    }

    static clearProgress(book) {
        const bookId = this.getBookId(book);
        const stored = this.getStoredData();
        delete stored[bookId];
        return this.setStoredData(stored);
    }

    static clearAll() {
        return this.setStoredData({});
    }
}
