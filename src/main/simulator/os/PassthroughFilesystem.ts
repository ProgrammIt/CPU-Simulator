import { accessSync, constants, existsSync } from 'node:fs';
import { FilesystemError } from '../../../types/errors/FilesystemError';

export class PassthroughFilesystem {
    private path: string;
    constructor(path: string) {
        // Perform basic tests to check whether the directory is available
        if (path == "/") {
            throw new FilesystemError("Filesystem path should not be the root directory (/)");
        }
        if (path == "") {
            // Use working directory as fallback
            path = ".";
        }
        if (!path.endsWith("/")) {
            path += "/"
        }
        if (!existsSync(path)) {
            throw new FilesystemError(path + " does not exist.")
        }
        accessSync(path, constants.R_OK | constants.W_OK);
        this.path = path;
    }

    public io_seek(fd: number, offset: number) {

    }
    public io_close(fd: number) {

    }
    public io_read_buffer(fd: number, buffer: any, b_szie: any): number {
        return 0; // return number of bytes read
    }
    public io_write_buffer(fd: number, buffer: any, b_szie: any): number {
        return 0; // return number of bytes written
    }
    public file_create(filename: string) {

    }
    public file_delete(filename: string): number {
        return 0; // return success status
    }
    public file_open(filename: string): number {
        return 0; // return file descriptor
    }
    public file_stat(filename: string): number {
        return 0; // return file length
    }
}