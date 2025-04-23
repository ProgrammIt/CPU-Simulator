


export class Filesystem {
    private files = new Map<string, File>();
    constructor() {
        // Example file
        this.createFile("a.txt")
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

    public openFile() {}
}

class File {
    private data: Uint8Array = new Uint8Array(0);
    private length = 0;


}












