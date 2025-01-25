export default interface OperandTypeDefinition {
    name: string;
    code: string;
    regexes: [
        {
            name: string;
            regex: string;
        }
    ] | null;
}