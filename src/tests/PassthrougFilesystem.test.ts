import { PassthroughFilesystem } from "../main/simulator/os/PassthroughFilesystem";
import { mkdtempSync, existsSync, writeFileSync, readFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FilesystemError } from "../types/errors/FilesystemError";

describe('PassthroughFilesystem', () => {
    let tmp: string;
    let fs: PassthroughFilesystem;

    beforeEach(() => {
        tmp = mkdtempSync(join(tmpdir(), 'PassthroughFilesystemTest-'));
        fs = new PassthroughFilesystem(tmp);
    });

    afterEach(() => {
        try {
            rmSync(tmp, { recursive: true, force: true });
        } catch (e) {
            // Ignore cleanup errors
        }
    });

    describe('constructor', () => {
        test('throws error when path is root', () => {
            expect(() => new PassthroughFilesystem('/')).toThrow(FilesystemError);
        });

        test('throws error if path does not exist', () => {
            const nonExistentPath = join(tmpdir(), `nonexistent-${Date.now()}`);
            expect(() => new PassthroughFilesystem(nonExistentPath)).toThrow(FilesystemError);
        });
    });

    describe('file operations', () => {
        test('file_create creates a new file', () => {
            const filename = 'testfile.txt';
            expect(fs.file_create(filename)).toBe(0);
            expect(existsSync(join(tmp, filename))).toBe(true);
        });

        test('file_create returns -1 if file exists', () => {
            const filename = 'existing.txt';
            writeFileSync(join(tmp, filename), '');
            expect(fs.file_create(filename)).toBe(-1);
        });

        test('file_delete removes existing file', () => {
            const filename = 'delete_me.txt';
            writeFileSync(join(tmp, filename), '');
            expect(fs.file_delete(filename)).toBe(0);
            expect(existsSync(join(tmp, filename))).toBe(false);
        });

        test('file_delete returns -1 for non-existent file', () => {
            expect(fs.file_delete('nonexistent.txt')).toBe(-1);
        });

        test('file_open returns valid fd for existing file', () => {
            const filename = 'open_me.txt';
            writeFileSync(join(tmp, filename), '');
            const fd = fs.file_open(filename);
            expect(fd).toBeGreaterThan(0);
            fs.io_close(fd);
        });

        test('file_open throws for non-existent file', () => {
            expect(fs.file_open('nonexistent.txt')).toBe(-1);
        });

        test('file_stat returns file size', () => {
            const filename = 'stat.txt';
            const content = 'test content';
            writeFileSync(join(tmp, filename), content);
            expect(fs.file_stat(filename)).toBe(Buffer.byteLength(content));
        });

        test('file_stat returns -1 for non-existent file', () => {
            expect(fs.file_stat('nonexistent.txt')).toBe(-1);
        });

        test('file_stat returns -2 for directory', () => {
            const dirname = 'subdir';
            mkdirSync(join(tmp, dirname));
            expect(fs.file_stat(dirname)).toBe(-2);
        });
    });

    describe('IO operations', () => {
        test('io_seek with invalid fd returns -1', () => {
            expect(fs.io_seek(999, 0, 0)).toBe(-1);
        });

        test('io_seek adjusts position correctly', () => {
            const filename = 'seek.txt';
            writeFileSync(join(tmp, filename), 'abcdef');
            const fd = fs.file_open(filename);
            expect(fs.io_seek(fd, 3, 0)).toBe(0);
            const buffer = new Uint8Array(3)
            const bytesRead = fs.io_read_buffer(fd, buffer, 3);
            expect(bytesRead).toBe(3);
            expect(buffer).toEqual(new Uint8Array([100, 101, 102])); // 'd', 'e', 'f'
            fs.io_close(fd);
        });

        test('io_seek returns -3 on negative position', () => {
            const filename = 'seek_negative.txt';
            writeFileSync(join(tmp, filename), 'abc');
            const fd = fs.file_open(filename);
            expect(fs.io_seek(fd, -1, 0)).toBe(-3);
            fs.io_close(fd);
        });

        test('io_read_buffer reads data correctly', () => {
            const filename = 'read.txt';
            writeFileSync(join(tmp, filename), new Uint8Array([1, 2, 3, 4, 5]));
            const fd = fs.file_open(filename);
            const buffer = new Uint8Array(3)
            const bytesRead = fs.io_read_buffer(fd, buffer, 3);
            expect(bytesRead).toBe(3);
            expect(buffer).toEqual(new Uint8Array([1, 2, 3]));
            fs.io_close(fd);
        });

        test('io_read_buffer returns -2 for invalid seek position', () => {
            const filename = 'read_beyond.txt';
            writeFileSync(join(tmp, filename), 'abc');
            const fd = fs.file_open(filename);
            fs.io_seek(fd, 4, 0); // Seek beyond file size
            const buffer = new Uint8Array(1)
            const result = fs.io_read_buffer(fd, buffer, 1);
            expect(result).toBe(-2);
            fs.io_close(fd);
        });

        // TODO buggy
        test('io_write_buffer writes data and updates position', () => {
            const filename = 'write_test.txt';
            fs.file_create(filename);
            const fd = fs.file_open(filename);
            const buffer = new Uint8Array([1, 2, 3]);
            expect(fs.io_write_buffer(fd, buffer, 3)).toBe(3);
            const b2 = readFileSync(join(tmp, filename));
            for (let i = 0; i < buffer.length; i++) {
                expect(b2[i]).toBe(buffer[i]);
            }
            fs.io_close(fd);
        });

        test('io_write_buffer returns -2 for invalid seek position', () => {
            const filename = 'write_beyond.txt';
            writeFileSync(join(tmp, filename), 'abc');
            const fd = fs.file_open(filename);
            fs.io_seek(fd, 4, 0); // Seek beyond file size
            expect(fs.io_write_buffer(fd, new Uint8Array([1]), 1)).toBe(-2);
            fs.io_close(fd);
        });

        test('io_close removes fd from tracking', () => {
            const filename = 'close.txt';
            writeFileSync(join(tmp, filename), '');
            const fd = fs.file_open(filename);
            fs.io_close(fd);
            expect(fs.io_seek(fd, 0, 0)).toBe(-1);
        });
    });
});