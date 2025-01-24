[**ihme-core-x1-simulator**](../../README.md)

***

[ihme-core-x1-simulator](../../modules.md) / [preload](../README.md) / Window

# Interface: Window

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25402

A window containing a DOM document; the document property points to the DOM document loaded in that window.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window)

## Extends

- `EventTarget`.`AnimationFrameProvider`.`GlobalEventHandlers`.`WindowEventHandlers`.`WindowLocalStorage`.`WindowOrWorkerGlobalScope`.`WindowSessionStorage`

## Indexable

\[`index`: `number`\]: [`Window`](Window.md)

## Properties

### caches

> `readonly` **caches**: `CacheStorage`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25757

Available only in secure contexts.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/caches)

#### Inherited from

`WindowOrWorkerGlobalScope.caches`

***

### ~~clientInformation~~

> `readonly` **clientInformation**: `Navigator`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25408

#### Deprecated

This is a legacy alias of `navigator`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/navigator)

***

### closed

> `readonly` **closed**: `boolean`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25414

Returns true if the window has been closed, false otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/closed)

***

### crossOriginIsolated

> `readonly` **crossOriginIsolated**: `boolean`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25759

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/crossOriginIsolated)

#### Inherited from

`WindowOrWorkerGlobalScope.crossOriginIsolated`

***

### crypto

> `readonly` **crypto**: `Crypto`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25761

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/crypto)

#### Inherited from

`WindowOrWorkerGlobalScope.crypto`

***

### customElements

> `readonly` **customElements**: `CustomElementRegistry`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25420

Defines a new custom element, mapping the given name to the given constructor as an autonomous custom element.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/customElements)

***

### devicePixelRatio

> `readonly` **devicePixelRatio**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25422

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/devicePixelRatio)

***

### document

> `readonly` **document**: `Document`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25424

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/document)

***

### ~~event~~

> `readonly` **event**: `undefined` \| `Event`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25430

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/event)

***

### ~~external~~

> `readonly` **external**: `External`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25436

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/external)

***

### frameElement

> `readonly` **frameElement**: `null` \| `Element`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25438

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/frameElement)

***

### frames

> `readonly` **frames**: [`Window`](Window.md)

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25440

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/frames)

***

### history

> `readonly` **history**: `History`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25442

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/history)

***

### indexedDB

> `readonly` **indexedDB**: `IDBFactory`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25763

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/indexedDB)

#### Inherited from

`WindowOrWorkerGlobalScope.indexedDB`

***

### innerHeight

> `readonly` **innerHeight**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25444

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/innerHeight)

***

### innerWidth

> `readonly` **innerWidth**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25446

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/innerWidth)

***

### isSecureContext

> `readonly` **isSecureContext**: `boolean`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25765

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/isSecureContext)

#### Inherited from

`WindowOrWorkerGlobalScope.isSecureContext`

***

### length

> `readonly` **length**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25448

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/length)

***

### localStorage

> `readonly` **localStorage**: `Storage`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25748

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/localStorage)

#### Inherited from

`WindowLocalStorage.localStorage`

***

### locationbar

> `readonly` **locationbar**: `BarProp`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25457

Returns true if the location bar is visible; otherwise, returns false.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/locationbar)

***

### mainMemory

> **mainMemory**: `any`

Defined in: [src/preload.ts:6](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/preload.ts#L6)

***

### menubar

> `readonly` **menubar**: `BarProp`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25463

Returns true if the menu bar is visible; otherwise, returns false.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/menubar)

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25465

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/name)

***

### navigator

> `readonly` **navigator**: `Navigator`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25467

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/navigator)

***

### onabort

> **onabort**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9032

Fires when the user aborts the download.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/abort_event)

#### Inherited from

`GlobalEventHandlers.onabort`

***

### onafterprint

> **onafterprint**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25701

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/afterprint_event)

#### Inherited from

`WindowEventHandlers.onafterprint`

***

### onanimationcancel

> **onanimationcancel**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9034

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationcancel_event)

#### Inherited from

`GlobalEventHandlers.onanimationcancel`

***

### onanimationend

> **onanimationend**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9036

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationend_event)

#### Inherited from

`GlobalEventHandlers.onanimationend`

***

### onanimationiteration

> **onanimationiteration**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9038

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationiteration_event)

#### Inherited from

`GlobalEventHandlers.onanimationiteration`

***

### onanimationstart

> **onanimationstart**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9040

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationstart_event)

#### Inherited from

`GlobalEventHandlers.onanimationstart`

***

### onauxclick

> **onauxclick**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9042

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/auxclick_event)

#### Inherited from

`GlobalEventHandlers.onauxclick`

***

### onbeforeinput

> **onbeforeinput**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9044

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/beforeinput_event)

#### Inherited from

`GlobalEventHandlers.onbeforeinput`

***

### onbeforeprint

> **onbeforeprint**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25703

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/beforeprint_event)

#### Inherited from

`WindowEventHandlers.onbeforeprint`

***

### onbeforetoggle

> **onbeforetoggle**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9046

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/beforetoggle_event)

#### Inherited from

`GlobalEventHandlers.onbeforetoggle`

***

### onbeforeunload

> **onbeforeunload**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25705

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/beforeunload_event)

#### Inherited from

`WindowEventHandlers.onbeforeunload`

***

### onblur

> **onblur**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9053

Fires when the object loses the input focus.

#### Param

The focus event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/blur_event)

#### Inherited from

`GlobalEventHandlers.onblur`

***

### oncancel

> **oncancel**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9055

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/cancel_event)

#### Inherited from

`GlobalEventHandlers.oncancel`

***

### oncanplay

> **oncanplay**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9062

Occurs when playback is possible, but would require further buffering.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/canplay_event)

#### Inherited from

`GlobalEventHandlers.oncanplay`

***

### oncanplaythrough

> **oncanplaythrough**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9064

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/canplaythrough_event)

#### Inherited from

`GlobalEventHandlers.oncanplaythrough`

***

### onchange

> **onchange**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9071

Fires when the contents of the object or selection have changed.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/change_event)

#### Inherited from

`GlobalEventHandlers.onchange`

***

### onclick

> **onclick**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9078

Fires when the user clicks the left mouse button on the object

#### Param

The mouse event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/click_event)

#### Inherited from

`GlobalEventHandlers.onclick`

***

### onclose

> **onclose**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9080

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/close_event)

#### Inherited from

`GlobalEventHandlers.onclose`

***

### oncontextlost

> **oncontextlost**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9082

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/webglcontextlost_event)

#### Inherited from

`GlobalEventHandlers.oncontextlost`

***

### oncontextmenu

> **oncontextmenu**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9089

Fires when the user clicks the right mouse button in the client area, opening the context menu.

#### Param

The mouse event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/contextmenu_event)

#### Inherited from

`GlobalEventHandlers.oncontextmenu`

***

### oncontextrestored

> **oncontextrestored**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9091

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/contextrestored_event)

#### Inherited from

`GlobalEventHandlers.oncontextrestored`

***

### oncopy

> **oncopy**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9093

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/copy_event)

#### Inherited from

`GlobalEventHandlers.oncopy`

***

### oncuechange

> **oncuechange**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9095

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLTrackElement/cuechange_event)

#### Inherited from

`GlobalEventHandlers.oncuechange`

***

### oncut

> **oncut**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9097

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/cut_event)

#### Inherited from

`GlobalEventHandlers.oncut`

***

### ondblclick

> **ondblclick**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9104

Fires when the user double-clicks the object.

#### Param

The mouse event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/dblclick_event)

#### Inherited from

`GlobalEventHandlers.ondblclick`

***

### ondevicemotion

> **ondevicemotion**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25473

Available only in secure contexts.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/devicemotion_event)

***

### ondeviceorientation

> **ondeviceorientation**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25479

Available only in secure contexts.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/deviceorientation_event)

***

### ondeviceorientationabsolute

> **ondeviceorientationabsolute**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25485

Available only in secure contexts.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/deviceorientationabsolute_event)

***

### ondrag

> **ondrag**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9111

Fires on the source object continuously during a drag operation.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/drag_event)

#### Inherited from

`GlobalEventHandlers.ondrag`

***

### ondragend

> **ondragend**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9118

Fires on the source object when the user releases the mouse at the close of a drag operation.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragend_event)

#### Inherited from

`GlobalEventHandlers.ondragend`

***

### ondragenter

> **ondragenter**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9125

Fires on the target element when the user drags the object to a valid drop target.

#### Param

The drag event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragenter_event)

#### Inherited from

`GlobalEventHandlers.ondragenter`

***

### ondragleave

> **ondragleave**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9132

Fires on the target object when the user moves the mouse out of a valid drop target during a drag operation.

#### Param

The drag event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragleave_event)

#### Inherited from

`GlobalEventHandlers.ondragleave`

***

### ondragover

> **ondragover**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9139

Fires on the target element continuously while the user drags the object over a valid drop target.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragover_event)

#### Inherited from

`GlobalEventHandlers.ondragover`

***

### ondragstart

> **ondragstart**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9146

Fires on the source object when the user starts to drag a text selection or selected object.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/dragstart_event)

#### Inherited from

`GlobalEventHandlers.ondragstart`

***

### ondrop

> **ondrop**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9148

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/drop_event)

#### Inherited from

`GlobalEventHandlers.ondrop`

***

### ondurationchange

> **ondurationchange**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9155

Occurs when the duration attribute is updated.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/durationchange_event)

#### Inherited from

`GlobalEventHandlers.ondurationchange`

***

### onemptied

> **onemptied**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9162

Occurs when the media element is reset to its initial state.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/emptied_event)

#### Inherited from

`GlobalEventHandlers.onemptied`

***

### onended

> **onended**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9169

Occurs when the end of playback is reached.

#### Param

The event

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ended_event)

#### Inherited from

`GlobalEventHandlers.onended`

***

### onerror

> **onerror**: `OnErrorEventHandler`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9176

Fires when an error occurs during object loading.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/error_event)

#### Inherited from

`GlobalEventHandlers.onerror`

***

### onfocus

> **onfocus**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9183

Fires when the object receives focus.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/focus_event)

#### Inherited from

`GlobalEventHandlers.onfocus`

***

### onformdata

> **onformdata**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9185

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/formdata_event)

#### Inherited from

`GlobalEventHandlers.onformdata`

***

### ongamepadconnected

> **ongamepadconnected**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25707

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/gamepadconnected_event)

#### Inherited from

`WindowEventHandlers.ongamepadconnected`

***

### ongamepaddisconnected

> **ongamepaddisconnected**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25709

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/gamepaddisconnected_event)

#### Inherited from

`WindowEventHandlers.ongamepaddisconnected`

***

### ongotpointercapture

> **ongotpointercapture**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9187

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/gotpointercapture_event)

#### Inherited from

`GlobalEventHandlers.ongotpointercapture`

***

### onhashchange

> **onhashchange**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25711

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/hashchange_event)

#### Inherited from

`WindowEventHandlers.onhashchange`

***

### oninput

> **oninput**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9189

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/input_event)

#### Inherited from

`GlobalEventHandlers.oninput`

***

### oninvalid

> **oninvalid**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9191

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/invalid_event)

#### Inherited from

`GlobalEventHandlers.oninvalid`

***

### onkeydown

> **onkeydown**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9198

Fires when the user presses a key.

#### Param

The keyboard event

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keydown_event)

#### Inherited from

`GlobalEventHandlers.onkeydown`

***

### ~~onkeypress~~

> **onkeypress**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9206

Fires when the user presses an alphanumeric key.

#### Param

The event.

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keypress_event)

#### Inherited from

`GlobalEventHandlers.onkeypress`

***

### onkeyup

> **onkeyup**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9213

Fires when the user releases a key.

#### Param

The keyboard event

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/keyup_event)

#### Inherited from

`GlobalEventHandlers.onkeyup`

***

### onlanguagechange

> **onlanguagechange**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25713

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/languagechange_event)

#### Inherited from

`WindowEventHandlers.onlanguagechange`

***

### onload

> **onload**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9220

Fires immediately after the browser loads the object.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/SVGElement/load_event)

#### Inherited from

`GlobalEventHandlers.onload`

***

### onloadeddata

> **onloadeddata**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9227

Occurs when media data is loaded at the current playback position.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadeddata_event)

#### Inherited from

`GlobalEventHandlers.onloadeddata`

***

### onloadedmetadata

> **onloadedmetadata**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9234

Occurs when the duration and dimensions of the media have been determined.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadedmetadata_event)

#### Inherited from

`GlobalEventHandlers.onloadedmetadata`

***

### onloadstart

> **onloadstart**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9241

Occurs when Internet Explorer begins looking for media data.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/loadstart_event)

#### Inherited from

`GlobalEventHandlers.onloadstart`

***

### onlostpointercapture

> **onlostpointercapture**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9243

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/lostpointercapture_event)

#### Inherited from

`GlobalEventHandlers.onlostpointercapture`

***

### onmessage

> **onmessage**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25715

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/message_event)

#### Inherited from

`WindowEventHandlers.onmessage`

***

### onmessageerror

> **onmessageerror**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25717

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/messageerror_event)

#### Inherited from

`WindowEventHandlers.onmessageerror`

***

### onmousedown

> **onmousedown**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9250

Fires when the user clicks the object with either mouse button.

#### Param

The mouse event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mousedown_event)

#### Inherited from

`GlobalEventHandlers.onmousedown`

***

### onmouseenter

> **onmouseenter**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9252

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseenter_event)

#### Inherited from

`GlobalEventHandlers.onmouseenter`

***

### onmouseleave

> **onmouseleave**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9254

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseleave_event)

#### Inherited from

`GlobalEventHandlers.onmouseleave`

***

### onmousemove

> **onmousemove**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9261

Fires when the user moves the mouse over the object.

#### Param

The mouse event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mousemove_event)

#### Inherited from

`GlobalEventHandlers.onmousemove`

***

### onmouseout

> **onmouseout**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9268

Fires when the user moves the mouse pointer outside the boundaries of the object.

#### Param

The mouse event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseout_event)

#### Inherited from

`GlobalEventHandlers.onmouseout`

***

### onmouseover

> **onmouseover**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9275

Fires when the user moves the mouse pointer into the object.

#### Param

The mouse event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseover_event)

#### Inherited from

`GlobalEventHandlers.onmouseover`

***

### onmouseup

> **onmouseup**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9282

Fires when the user releases a mouse button while the mouse is over the object.

#### Param

The mouse event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/mouseup_event)

#### Inherited from

`GlobalEventHandlers.onmouseup`

***

### onoffline

> **onoffline**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25719

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/offline_event)

#### Inherited from

`WindowEventHandlers.onoffline`

***

### ononline

> **ononline**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25721

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/online_event)

#### Inherited from

`WindowEventHandlers.ononline`

***

### ~~onorientationchange~~

> **onorientationchange**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25491

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/orientationchange_event)

***

### onpagehide

> **onpagehide**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25723

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/pagehide_event)

#### Inherited from

`WindowEventHandlers.onpagehide`

***

### onpageshow

> **onpageshow**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25725

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/pageshow_event)

#### Inherited from

`WindowEventHandlers.onpageshow`

***

### onpaste

> **onpaste**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9284

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/paste_event)

#### Inherited from

`GlobalEventHandlers.onpaste`

***

### onpause

> **onpause**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9291

Occurs when playback is paused.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/pause_event)

#### Inherited from

`GlobalEventHandlers.onpause`

***

### onplay

> **onplay**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9298

Occurs when the play method is requested.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/play_event)

#### Inherited from

`GlobalEventHandlers.onplay`

***

### onplaying

> **onplaying**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9305

Occurs when the audio or video has started playing.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/playing_event)

#### Inherited from

`GlobalEventHandlers.onplaying`

***

### onpointercancel

> **onpointercancel**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9307

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointercancel_event)

#### Inherited from

`GlobalEventHandlers.onpointercancel`

***

### onpointerdown

> **onpointerdown**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9309

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerdown_event)

#### Inherited from

`GlobalEventHandlers.onpointerdown`

***

### onpointerenter

> **onpointerenter**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9311

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerenter_event)

#### Inherited from

`GlobalEventHandlers.onpointerenter`

***

### onpointerleave

> **onpointerleave**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9313

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerleave_event)

#### Inherited from

`GlobalEventHandlers.onpointerleave`

***

### onpointermove

> **onpointermove**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9315

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointermove_event)

#### Inherited from

`GlobalEventHandlers.onpointermove`

***

### onpointerout

> **onpointerout**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9317

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerout_event)

#### Inherited from

`GlobalEventHandlers.onpointerout`

***

### onpointerover

> **onpointerover**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9319

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerover_event)

#### Inherited from

`GlobalEventHandlers.onpointerover`

***

### onpointerup

> **onpointerup**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9321

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/pointerup_event)

#### Inherited from

`GlobalEventHandlers.onpointerup`

***

### onpopstate

> **onpopstate**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25727

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/popstate_event)

#### Inherited from

`WindowEventHandlers.onpopstate`

***

### onprogress

> **onprogress**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9328

Occurs to indicate progress while downloading media data.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/progress_event)

#### Inherited from

`GlobalEventHandlers.onprogress`

***

### onratechange

> **onratechange**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9335

Occurs when the playback rate is increased or decreased.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ratechange_event)

#### Inherited from

`GlobalEventHandlers.onratechange`

***

### onrejectionhandled

> **onrejectionhandled**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25729

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/rejectionhandled_event)

#### Inherited from

`WindowEventHandlers.onrejectionhandled`

***

### onreset

> **onreset**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9342

Fires when the user resets a form.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/reset_event)

#### Inherited from

`GlobalEventHandlers.onreset`

***

### onresize

> **onresize**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9344

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement/resize_event)

#### Inherited from

`GlobalEventHandlers.onresize`

***

### onscroll

> **onscroll**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9351

Fires when the user repositions the scroll box in the scroll bar on the object.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/scroll_event)

#### Inherited from

`GlobalEventHandlers.onscroll`

***

### onscrollend

> **onscrollend**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9353

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/scrollend_event)

#### Inherited from

`GlobalEventHandlers.onscrollend`

***

### onsecuritypolicyviolation

> **onsecuritypolicyviolation**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9355

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/securitypolicyviolation_event)

#### Inherited from

`GlobalEventHandlers.onsecuritypolicyviolation`

***

### onseeked

> **onseeked**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9362

Occurs when the seek operation ends.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/seeked_event)

#### Inherited from

`GlobalEventHandlers.onseeked`

***

### onseeking

> **onseeking**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9369

Occurs when the current playback position is moved.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/seeking_event)

#### Inherited from

`GlobalEventHandlers.onseeking`

***

### onselect

> **onselect**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9376

Fires when the current selection changes.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/select_event)

#### Inherited from

`GlobalEventHandlers.onselect`

***

### onselectionchange

> **onselectionchange**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9378

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/selectionchange_event)

#### Inherited from

`GlobalEventHandlers.onselectionchange`

***

### onselectstart

> **onselectstart**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9380

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/selectstart_event)

#### Inherited from

`GlobalEventHandlers.onselectstart`

***

### onslotchange

> **onslotchange**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9382

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLSlotElement/slotchange_event)

#### Inherited from

`GlobalEventHandlers.onslotchange`

***

### onstalled

> **onstalled**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9389

Occurs when the download has stopped.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/stalled_event)

#### Inherited from

`GlobalEventHandlers.onstalled`

***

### onstorage

> **onstorage**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25731

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/storage_event)

#### Inherited from

`WindowEventHandlers.onstorage`

***

### onsubmit

> **onsubmit**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9391

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/submit_event)

#### Inherited from

`GlobalEventHandlers.onsubmit`

***

### onsuspend

> **onsuspend**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9398

Occurs if the load operation has been intentionally halted.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/suspend_event)

#### Inherited from

`GlobalEventHandlers.onsuspend`

***

### ontimeupdate

> **ontimeupdate**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9405

Occurs to indicate the current playback position.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/timeupdate_event)

#### Inherited from

`GlobalEventHandlers.ontimeupdate`

***

### ontoggle

> **ontoggle**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9407

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDetailsElement/toggle_event)

#### Inherited from

`GlobalEventHandlers.ontoggle`

***

### ontouchcancel?

> `optional` **ontouchcancel**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9409

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchcancel_event)

#### Inherited from

`GlobalEventHandlers.ontouchcancel`

***

### ontouchend?

> `optional` **ontouchend**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9411

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchend_event)

#### Inherited from

`GlobalEventHandlers.ontouchend`

***

### ontouchmove?

> `optional` **ontouchmove**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9413

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchmove_event)

#### Inherited from

`GlobalEventHandlers.ontouchmove`

***

### ontouchstart?

> `optional` **ontouchstart**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9415

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/touchstart_event)

#### Inherited from

`GlobalEventHandlers.ontouchstart`

***

### ontransitioncancel

> **ontransitioncancel**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9417

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitioncancel_event)

#### Inherited from

`GlobalEventHandlers.ontransitioncancel`

***

### ontransitionend

> **ontransitionend**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9419

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionend_event)

#### Inherited from

`GlobalEventHandlers.ontransitionend`

***

### ontransitionrun

> **ontransitionrun**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9421

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionrun_event)

#### Inherited from

`GlobalEventHandlers.ontransitionrun`

***

### ontransitionstart

> **ontransitionstart**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9423

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionstart_event)

#### Inherited from

`GlobalEventHandlers.ontransitionstart`

***

### onunhandledrejection

> **onunhandledrejection**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25733

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/unhandledrejection_event)

#### Inherited from

`WindowEventHandlers.onunhandledrejection`

***

### ~~onunload~~

> **onunload**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25739

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/unload_event)

#### Inherited from

`WindowEventHandlers.onunload`

***

### onvolumechange

> **onvolumechange**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9430

Occurs when the volume is changed, or playback is muted or unmuted.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/volumechange_event)

#### Inherited from

`GlobalEventHandlers.onvolumechange`

***

### onwaiting

> **onwaiting**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9437

Occurs when playback stops because the next frame of a video resource is not available.

#### Param

The event.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/waiting_event)

#### Inherited from

`GlobalEventHandlers.onwaiting`

***

### ~~onwebkitanimationend~~

> **onwebkitanimationend**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9443

#### Deprecated

This is a legacy alias of `onanimationend`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationend_event)

#### Inherited from

`GlobalEventHandlers.onwebkitanimationend`

***

### ~~onwebkitanimationiteration~~

> **onwebkitanimationiteration**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9449

#### Deprecated

This is a legacy alias of `onanimationiteration`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationiteration_event)

#### Inherited from

`GlobalEventHandlers.onwebkitanimationiteration`

***

### ~~onwebkitanimationstart~~

> **onwebkitanimationstart**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9455

#### Deprecated

This is a legacy alias of `onanimationstart`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/animationstart_event)

#### Inherited from

`GlobalEventHandlers.onwebkitanimationstart`

***

### ~~onwebkittransitionend~~

> **onwebkittransitionend**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9461

#### Deprecated

This is a legacy alias of `ontransitionend`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/transitionend_event)

#### Inherited from

`GlobalEventHandlers.onwebkittransitionend`

***

### onwheel

> **onwheel**: `null` \| (`this`, `ev`) => `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:9463

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/wheel_event)

#### Inherited from

`GlobalEventHandlers.onwheel`

***

### opener

> **opener**: `any`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25493

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/opener)

***

### ~~orientation~~

> `readonly` **orientation**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25499

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/orientation)

***

### origin

> `readonly` **origin**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25767

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/origin)

#### Inherited from

`WindowOrWorkerGlobalScope.origin`

***

### outerHeight

> `readonly` **outerHeight**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25501

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/outerHeight)

***

### outerWidth

> `readonly` **outerWidth**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25503

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/outerWidth)

***

### ~~pageXOffset~~

> `readonly` **pageXOffset**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25509

#### Deprecated

This is a legacy alias of `scrollX`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/scrollX)

***

### ~~pageYOffset~~

> `readonly` **pageYOffset**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25515

#### Deprecated

This is a legacy alias of `scrollY`.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/scrollY)

***

### parent

> `readonly` **parent**: [`Window`](Window.md)

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25523

Refers to either the parent WindowProxy, or itself.

It can rarely be null e.g. for contentWindow of an iframe that is already removed from the parent.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/parent)

***

### performance

> `readonly` **performance**: `Performance`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25769

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/performance)

#### Inherited from

`WindowOrWorkerGlobalScope.performance`

***

### personalbar

> `readonly` **personalbar**: `BarProp`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25529

Returns true if the personal bar is visible; otherwise, returns false.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/personalbar)

***

### screen

> `readonly` **screen**: `Screen`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25531

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/screen)

***

### screenLeft

> `readonly` **screenLeft**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25533

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/screenLeft)

***

### screenTop

> `readonly` **screenTop**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25535

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/screenTop)

***

### screenX

> `readonly` **screenX**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25537

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/screenX)

***

### screenY

> `readonly` **screenY**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25539

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/screenY)

***

### scrollbars

> `readonly` **scrollbars**: `BarProp`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25549

Returns true if the scrollbars are visible; otherwise, returns false.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/scrollbars)

***

### scrollX

> `readonly` **scrollX**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25541

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/scrollX)

***

### scrollY

> `readonly` **scrollY**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25543

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/scrollY)

***

### self

> `readonly` **self**: [`Window`](Window.md) & *typeof* `globalThis`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25551

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/self)

***

### sessionStorage

> `readonly` **sessionStorage**: `Storage`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25797

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/sessionStorage)

#### Inherited from

`WindowSessionStorage.sessionStorage`

***

### simulator

> **simulator**: `any`

Defined in: [src/preload.ts:7](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/preload.ts#L7)

***

### speechSynthesis

> `readonly` **speechSynthesis**: `SpeechSynthesis`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25553

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/speechSynthesis)

***

### ~~status~~

> **status**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25559

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/status)

***

### statusbar

> `readonly` **statusbar**: `BarProp`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25565

Returns true if the status bar is visible; otherwise, returns false.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/statusbar)

***

### toolbar

> `readonly` **toolbar**: `BarProp`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25571

Returns true if the toolbar is visible; otherwise, returns false.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/toolbar)

***

### top

> `readonly` **top**: `null` \| [`Window`](Window.md)

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25573

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/top)

***

### visualViewport

> `readonly` **visualViewport**: `null` \| `VisualViewport`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25575

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/visualViewport)

***

### window

> `readonly` **window**: [`Window`](Window.md) & *typeof* `globalThis`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25577

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/window)

## Accessors

### location

#### Get Signature

> **get** **location**(): `Location`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25450

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/location)

##### Returns

`Location`

#### Set Signature

> **set** **location**(`href`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25451

##### Parameters

###### href

`string` | `Location`

##### Returns

`void`

## Methods

### addEventListener()

#### Call Signature

> **addEventListener**\<`K`\>(`type`, `listener`, `options`?): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25666

Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.

The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.

When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.

When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.

When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.

If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.

The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)

##### Type Parameters

• **K** *extends* keyof `WindowEventMap`

##### Parameters

###### type

`K`

###### listener

(`this`, `ev`) => `any`

###### options?

`boolean` | `AddEventListenerOptions`

##### Returns

`void`

##### Overrides

`EventTarget.addEventListener`

#### Call Signature

> **addEventListener**(`type`, `listener`, `options`?): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25667

Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.

The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.

When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.

When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.

When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.

If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.

The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)

##### Parameters

###### type

`string`

###### listener

`EventListenerOrEventListenerObject`

###### options?

`boolean` | `AddEventListenerOptions`

##### Returns

`void`

##### Overrides

`EventTarget.addEventListener`

***

### alert()

> **alert**(`message`?): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25579

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/alert)

#### Parameters

##### message?

`any`

#### Returns

`void`

***

### atob()

> **atob**(`data`): `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25771

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/atob)

#### Parameters

##### data

`string`

#### Returns

`string`

#### Inherited from

`WindowOrWorkerGlobalScope.atob`

***

### ~~blur()~~

> **blur**(): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25585

#### Returns

`void`

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/blur)

***

### btoa()

> **btoa**(`data`): `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25773

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/btoa)

#### Parameters

##### data

`string`

#### Returns

`string`

#### Inherited from

`WindowOrWorkerGlobalScope.btoa`

***

### cancelAnimationFrame()

> **cancelAnimationFrame**(`handle`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:2563

[MDN Reference](https://developer.mozilla.org/docs/Web/API/DedicatedWorkerGlobalScope/cancelAnimationFrame)

#### Parameters

##### handle

`number`

#### Returns

`void`

#### Inherited from

`AnimationFrameProvider.cancelAnimationFrame`

***

### cancelIdleCallback()

> **cancelIdleCallback**(`handle`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25587

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/cancelIdleCallback)

#### Parameters

##### handle

`number`

#### Returns

`void`

***

### ~~captureEvents()~~

> **captureEvents**(): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25593

#### Returns

`void`

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/captureEvents)

***

### clearInterval()

> **clearInterval**(`id`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25775

[MDN Reference](https://developer.mozilla.org/docs/Web/API/clearInterval)

#### Parameters

##### id

`undefined` | `number`

#### Returns

`void`

#### Inherited from

`WindowOrWorkerGlobalScope.clearInterval`

***

### clearTimeout()

> **clearTimeout**(`id`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25777

[MDN Reference](https://developer.mozilla.org/docs/Web/API/clearTimeout)

#### Parameters

##### id

`undefined` | `number`

#### Returns

`void`

#### Inherited from

`WindowOrWorkerGlobalScope.clearTimeout`

***

### close()

> **close**(): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25599

Closes the window.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/close)

#### Returns

`void`

***

### confirm()

> **confirm**(`message`?): `boolean`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25601

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/confirm)

#### Parameters

##### message?

`string`

#### Returns

`boolean`

***

### createImageBitmap()

#### Call Signature

> **createImageBitmap**(`image`, `options`?): `Promise`\<`ImageBitmap`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25779

[MDN Reference](https://developer.mozilla.org/docs/Web/API/createImageBitmap)

##### Parameters

###### image

`ImageBitmapSource`

###### options?

`ImageBitmapOptions`

##### Returns

`Promise`\<`ImageBitmap`\>

##### Inherited from

`WindowOrWorkerGlobalScope.createImageBitmap`

#### Call Signature

> **createImageBitmap**(`image`, `sx`, `sy`, `sw`, `sh`, `options`?): `Promise`\<`ImageBitmap`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25780

##### Parameters

###### image

`ImageBitmapSource`

###### sx

`number`

###### sy

`number`

###### sw

`number`

###### sh

`number`

###### options?

`ImageBitmapOptions`

##### Returns

`Promise`\<`ImageBitmap`\>

##### Inherited from

`WindowOrWorkerGlobalScope.createImageBitmap`

***

### dispatchEvent()

> **dispatchEvent**(`event`): `boolean`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:8309

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

#### Parameters

##### event

`Event`

#### Returns

`boolean`

#### Inherited from

`EventTarget.dispatchEvent`

***

### fetch()

> **fetch**(`input`, `init`?): `Promise`\<`Response`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25782

[MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)

#### Parameters

##### input

`URL` | `RequestInfo`

##### init?

`RequestInit`

#### Returns

`Promise`\<`Response`\>

#### Inherited from

`WindowOrWorkerGlobalScope.fetch`

***

### focus()

> **focus**(): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25607

Moves the focus to the window's browsing context, if any.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/focus)

#### Returns

`void`

***

### getComputedStyle()

> **getComputedStyle**(`elt`, `pseudoElt`?): `CSSStyleDeclaration`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25609

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/getComputedStyle)

#### Parameters

##### elt

`Element`

##### pseudoElt?

`null` | `string`

#### Returns

`CSSStyleDeclaration`

***

### getSelection()

> **getSelection**(): `null` \| `Selection`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25611

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/getSelection)

#### Returns

`null` \| `Selection`

***

### matchMedia()

> **matchMedia**(`query`): `MediaQueryList`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25613

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/matchMedia)

#### Parameters

##### query

`string`

#### Returns

`MediaQueryList`

***

### moveBy()

> **moveBy**(`x`, `y`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25615

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/moveBy)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### moveTo()

> **moveTo**(`x`, `y`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25617

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/moveTo)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### open()

> **open**(`url`?, `target`?, `features`?): `null` \| [`Window`](Window.md)

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25619

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/open)

#### Parameters

##### url?

`string` | `URL`

##### target?

`string`

##### features?

`string`

#### Returns

`null` \| [`Window`](Window.md)

***

### postMessage()

#### Call Signature

> **postMessage**(`message`, `targetOrigin`, `transfer`?): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25633

Posts a message to the given window. Messages can be structured objects, e.g. nested objects and arrays, can contain JavaScript values (strings, numbers, Date objects, etc), and can contain certain data objects such as File Blob, FileList, and ArrayBuffer objects.

Objects listed in the transfer member of options are transferred, not just cloned, meaning that they are no longer usable on the sending side.

A target origin can be specified using the targetOrigin member of options. If not provided, it defaults to "/". This default restricts the message to same-origin targets only.

If the origin of the target window doesn't match the given target origin, the message is discarded, to avoid information leakage. To send the message to the target regardless of origin, set the target origin to "*".

Throws a "DataCloneError" DOMException if transfer array contains duplicate objects or if message could not be cloned.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/postMessage)

##### Parameters

###### message

`any`

###### targetOrigin

`string`

###### transfer?

`Transferable`[]

##### Returns

`void`

#### Call Signature

> **postMessage**(`message`, `options`?): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25634

##### Parameters

###### message

`any`

###### options?

`WindowPostMessageOptions`

##### Returns

`void`

***

### print()

> **print**(): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25636

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/print)

#### Returns

`void`

***

### prompt()

> **prompt**(`message`?, `_default`?): `null` \| `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25638

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/prompt)

#### Parameters

##### message?

`string`

##### \_default?

`string`

#### Returns

`null` \| `string`

***

### queueMicrotask()

> **queueMicrotask**(`callback`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25784

[MDN Reference](https://developer.mozilla.org/docs/Web/API/queueMicrotask)

#### Parameters

##### callback

`VoidFunction`

#### Returns

`void`

#### Inherited from

`WindowOrWorkerGlobalScope.queueMicrotask`

***

### ~~releaseEvents()~~

> **releaseEvents**(): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25644

#### Returns

`void`

#### Deprecated

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/releaseEvents)

***

### removeEventListener()

#### Call Signature

> **removeEventListener**\<`K`\>(`type`, `listener`, `options`?): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25668

Removes the event listener in target's event listener list with the same type, callback, and options.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/removeEventListener)

##### Type Parameters

• **K** *extends* keyof `WindowEventMap`

##### Parameters

###### type

`K`

###### listener

(`this`, `ev`) => `any`

###### options?

`boolean` | `EventListenerOptions`

##### Returns

`void`

##### Overrides

`EventTarget.removeEventListener`

#### Call Signature

> **removeEventListener**(`type`, `listener`, `options`?): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25669

Removes the event listener in target's event listener list with the same type, callback, and options.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/removeEventListener)

##### Parameters

###### type

`string`

###### listener

`EventListenerOrEventListenerObject`

###### options?

`boolean` | `EventListenerOptions`

##### Returns

`void`

##### Overrides

`EventTarget.removeEventListener`

***

### reportError()

> **reportError**(`e`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25786

[MDN Reference](https://developer.mozilla.org/docs/Web/API/reportError)

#### Parameters

##### e

`any`

#### Returns

`void`

#### Inherited from

`WindowOrWorkerGlobalScope.reportError`

***

### requestAnimationFrame()

> **requestAnimationFrame**(`callback`): `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:2565

[MDN Reference](https://developer.mozilla.org/docs/Web/API/DedicatedWorkerGlobalScope/requestAnimationFrame)

#### Parameters

##### callback

`FrameRequestCallback`

#### Returns

`number`

#### Inherited from

`AnimationFrameProvider.requestAnimationFrame`

***

### requestIdleCallback()

> **requestIdleCallback**(`callback`, `options`?): `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25646

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback)

#### Parameters

##### callback

`IdleRequestCallback`

##### options?

`IdleRequestOptions`

#### Returns

`number`

***

### resizeBy()

> **resizeBy**(`x`, `y`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25648

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/resizeBy)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`void`

***

### resizeTo()

> **resizeTo**(`width`, `height`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25650

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/resizeTo)

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`void`

***

### scroll()

#### Call Signature

> **scroll**(`options`?): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25652

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/scroll)

##### Parameters

###### options?

`ScrollToOptions`

##### Returns

`void`

#### Call Signature

> **scroll**(`x`, `y`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25653

##### Parameters

###### x

`number`

###### y

`number`

##### Returns

`void`

***

### scrollBy()

#### Call Signature

> **scrollBy**(`options`?): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25655

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/scrollBy)

##### Parameters

###### options?

`ScrollToOptions`

##### Returns

`void`

#### Call Signature

> **scrollBy**(`x`, `y`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25656

##### Parameters

###### x

`number`

###### y

`number`

##### Returns

`void`

***

### scrollTo()

#### Call Signature

> **scrollTo**(`options`?): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25658

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/scrollTo)

##### Parameters

###### options?

`ScrollToOptions`

##### Returns

`void`

#### Call Signature

> **scrollTo**(`x`, `y`): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25659

##### Parameters

###### x

`number`

###### y

`number`

##### Returns

`void`

***

### setInterval()

> **setInterval**(`handler`, `timeout`?, ...`arguments`?): `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25788

[MDN Reference](https://developer.mozilla.org/docs/Web/API/setInterval)

#### Parameters

##### handler

`TimerHandler`

##### timeout?

`number`

##### arguments?

...`any`[]

#### Returns

`number`

#### Inherited from

`WindowOrWorkerGlobalScope.setInterval`

***

### setTimeout()

> **setTimeout**(`handler`, `timeout`?, ...`arguments`?): `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25790

[MDN Reference](https://developer.mozilla.org/docs/Web/API/setTimeout)

#### Parameters

##### handler

`TimerHandler`

##### timeout?

`number`

##### arguments?

...`any`[]

#### Returns

`number`

#### Inherited from

`WindowOrWorkerGlobalScope.setTimeout`

***

### stop()

> **stop**(): `void`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25665

Cancels the document load.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/stop)

#### Returns

`void`

***

### structuredClone()

> **structuredClone**\<`T`\>(`value`, `options`?): `T`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:25792

[MDN Reference](https://developer.mozilla.org/docs/Web/API/structuredClone)

#### Type Parameters

• **T** = `any`

#### Parameters

##### value

`T`

##### options?

`StructuredSerializeOptions`

#### Returns

`T`

#### Inherited from

`WindowOrWorkerGlobalScope.structuredClone`
