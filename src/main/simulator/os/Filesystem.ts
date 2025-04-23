
class FileDescriptor {
    public filename: string;
    public seekPosition: number = 0;
    constructor(filename: string) {
        this.filename = filename;
    }
}

class File {
    public data: Uint8Array = new Uint8Array(0);
    public length = 0;
}

export class Filesystem {
    private files = new Map<string, File>();
    private fds = new Map<number, FileDescriptor>();
    private fdsCounter = 1; // start at 1, as 0 is reserved for the console.
    constructor() {
        // Example file
        this.createFile("abc")
    }

    /**
     * Create a new empty file in the filesystem. No-op if the file already exists.
     * @param filename
     */
    public createFile(filename: string) {
        if (!this.files.has(filename)) {
            this.files.set(filename, new File());
        }
    }

    /**
     * Open a file and return its handle.
     * Returns -1 if the file does not exist.
     * @param filename 
     * @returns File handle or -1 on error.
     */
    public openFile(filename: string): number {
        // check if file exists
        if (!this.files.has(filename)) {
            // file does not exist
            return -1;
        }
        // create new handle
        let fd = this.fdsCounter;
        this.fdsCounter++;
        this.fds.set(fd, new FileDescriptor(filename));
        return fd;
    }

    /**
     * Returns length of the file.
     * Returns -1 if the file does not exist.
     * @param filename 
     * @returns Length or -1 on error.
     */
    public stat(filename: string): number {
        // check if file exists
        if (!this.files.has(filename)) {
            // file does not exist
            return -1;
        }
        return this.files.get(filename)!.length;
    }
}














