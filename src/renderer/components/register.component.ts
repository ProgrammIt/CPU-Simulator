import { Component } from "../Component";
import { Action, Message } from "../Message";
import template from "./register.component.html";

/**
 * This class accompanies the template register.component.html.
 * It is used to (re-)render the component with the members values of this class.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class RegisterComponent extends Component {
    /**
     * This member stores the id of the register widget.
     */
    private readonly _id: string;

    /**
     * This member stores the representation of the data contained in the register.
     */
    private _dataRepresentation: string;

    /**
     * This member stores the title of the register.
     */
    private _title: string;

    /**
     * This member stores a short description of the register.
     */
    private _description: string;

    /**
     * This member stores the registers content.
     */
    private _registerContent: string;

    /**
     * This member stores a reference to the div element containing the components title.
     * @readonly
     */
    private readonly _registerTitleDiv: HTMLDivElement;

    /**
     * This member stores a reference to the div element containing the components description.
     * @readonly
     */
    private readonly _registerDescriptionDiv: HTMLDivElement;

    /**
     * This member stores a reference to the div element containing the components content.
     * @readonly
     */
    private readonly _registerContentDiv: HTMLDivElement;

    /**
     * This member stores a reference to the select element for choosing the data representation.
     * @readonly
     */
    private readonly _registerRepresentationSelect: HTMLSelectElement;

    /**
     * Constructs an instance of the register component with the given values for its members.
     * @param id The id of the register widget.
     * @param dataRepresentation The representation of the data contained in the register.
     * @param title The title of the register.
     * @param description A short description of the register.
     * @param registerContent The registers content.
     */
    public constructor(
        id: string, 
        dataRepresentation: string, 
        title: string, 
        description: string, 
        registerContent: string
    ) {
        super(new Map([
            ["id", id],
            ["representation", dataRepresentation],
            ["title", title],
            ["description", description],
            ["content", registerContent]
        ]));
        this._template = template;
        this._id = id;
        this._dataRepresentation = dataRepresentation;
        this._title = title;
        this._description = description;
        this._registerContent = registerContent;
        this._registerTitleDiv = 
            document.getElementById(`{{ ${id} }}-title`)! as HTMLDivElement;
        this._registerDescriptionDiv = 
            document.getElementById(`{{ ${id} }}-description`)! as HTMLDivElement;
        this._registerContentDiv = 
            document.getElementById(`{{ ${id} }}-content`)! as HTMLDivElement;
        this._registerRepresentationSelect = 
            document.getElementById(`{{ ${id} }}-select`)! as HTMLSelectElement;
    }

    /**
     * This method creates a document fragment from the template and replaces all placeholders in 
     * the template by the members values associated with this class.
     * @returns A document fragment ready to be inserted into the document object model (DOM).
     * @override
     */
    public init(): string {
        let templateCopy: string = this._template;
        this._args.forEach((value, key) => {
            templateCopy = templateCopy.replace(`{{ ${key} }}`, value);
        });
        return templateCopy;
    }

    /**
     * This method updates the rendered component based on the changes made to its data.
     * @override
     */
    public update(): void {
        if (this.differ("representation", this._dataRepresentation)) {
            this._registerRepresentationSelect.value = this._dataRepresentation;
            this._args.set("data_representation", this._dataRepresentation);
        }
        if (this.differ("title", this._title)) {
            this._registerTitleDiv.innerText = this._title;
            this._args.set("title", this._title);
        }
        if (this.differ("description", this._description)) {
            this._registerDescriptionDiv.innerText = this._description;
            this._args.set("description", this._description);
        }
        if (this.differ("content", this._registerContent)) {
            this._registerContentDiv.innerText = this._registerContent;
            this._args.set("register_content", this._registerContent);
        }
    }

    /**
     * This method processes a given message.
     * @param msg The message to process. 
     * @override
     */
    public processMessage(msg: Message): void {
        if (msg.action === Action.UPDATE) {
            const payload: Map<string, string> = msg.payload;
            if (payload.has("data_representation")) {
                this._dataRepresentation = payload.get("data_representation")!;
            }
            if (payload.has("title")) {
                this._title = payload.get("title")!;
            }
            if (payload.has("description")) {
                this._description = payload.get("description")!;
            }
            if (payload.has("register_content")) {
                this._registerContent = payload.get("register_content")!;
            }
            this.update();
        } else if (msg.action === Action.DISABLE) {
            this._registerRepresentationSelect.setAttribute("disabled", "disabled");
        } else if (msg.action === Action.ENABLE) {
            this._registerRepresentationSelect.removeAttribute("disabled");
        }
    }
}