(function () {
'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var knockoutLatest_debug = createCommonjsModule(function (module, exports) {
/*!
 * Knockout JavaScript library v3.4.1
 * (c) The Knockout.js team - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function(){
var DEBUG=true;
(function(undefined){
    // (0, eval)('this') is a robust way of getting a reference to the global object
    // For details, see http://stackoverflow.com/questions/14119988/return-this-0-evalthis/14120023#14120023
    var window = this || (0, eval)('this'),
        document = window['document'],
        navigator = window['navigator'],
        jQueryInstance = window["jQuery"],
        JSON = window["JSON"];
(function(factory) {
    // Support three module loading scenarios
    if (typeof undefined === 'function' && undefined['amd']) {
        // [1] AMD anonymous module
        undefined(['exports', 'require'], factory);
    } else {
        // [2] CommonJS/Node.js
        factory(module['exports'] || exports);  // module.exports is for Node.js
    }
}(function(koExports, amdRequire){
// Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
// In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
var ko = typeof koExports !== 'undefined' ? koExports : {};
// Google Closure Compiler helpers (used only to make the minified file smaller)
ko.exportSymbol = function(koPath, object) {
    var tokens = koPath.split(".");

    // In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
    // At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
    var target = ko;

    for (var i = 0; i < tokens.length - 1; i++)
        target = target[tokens[i]];
    target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
    owner[publicName] = object;
};
ko.version = "3.4.1";

ko.exportSymbol('version', ko.version);
// For any options that may affect various areas of Knockout and aren't directly associated with data binding.
ko.options = {
    'deferUpdates': false,
    'useOnlyNativeEvents': false
};

//ko.exportSymbol('options', ko.options);   // 'options' isn't minified
ko.utils = (function () {
    function objectForEach(obj, action) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                action(prop, obj[prop]);
            }
        }
    }

    function extend(target, source) {
        if (source) {
            for(var prop in source) {
                if(source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }

    function setPrototypeOf(obj, proto) {
        obj.__proto__ = proto;
        return obj;
    }

    var canSetPrototype = ({ __proto__: [] } instanceof Array);
    var canUseSymbols = !DEBUG && typeof Symbol === 'function';

    // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
    var knownEvents = {}, knownEventTypesByEventName = {};
    var keyEventTypeName = (navigator && /Firefox\/2/i.test(navigator.userAgent)) ? 'KeyboardEvent' : 'UIEvents';
    knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
    knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
    objectForEach(knownEvents, function(eventType, knownEventsForType) {
        if (knownEventsForType.length) {
            for (var i = 0, j = knownEventsForType.length; i < j; i++)
                knownEventTypesByEventName[knownEventsForType[i]] = eventType;
        }
    });
    var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406

    // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
    // Note that, since IE 10 does not support conditional comments, the following logic only detects IE < 10.
    // Currently this is by design, since IE 10+ behaves correctly when treated as a standard browser.
    // If there is a future need to detect specific versions of IE10+, we will amend this.
    var ieVersion = document && (function() {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        ) {}
        return version > 4 ? version : undefined;
    }());
    var isIe6 = ieVersion === 6,
        isIe7 = ieVersion === 7;

    function isClickOnCheckableElement(element, eventType) {
        if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
        if (eventType.toLowerCase() != "click") return false;
        var inputType = element.type;
        return (inputType == "checkbox") || (inputType == "radio");
    }

    // For details on the pattern for changing node classes
    // see: https://github.com/knockout/knockout/issues/1597
    var cssClassNameRegex = /\S+/g;

    function toggleDomNodeCssClass(node, classNames, shouldHaveClass) {
        var addOrRemoveFn;
        if (classNames) {
            if (typeof node.classList === 'object') {
                addOrRemoveFn = node.classList[shouldHaveClass ? 'add' : 'remove'];
                ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
                    addOrRemoveFn.call(node.classList, className);
                });
            } else if (typeof node.className['baseVal'] === 'string') {
                // SVG tag .classNames is an SVGAnimatedString instance
                toggleObjectClassPropertyString(node.className, 'baseVal', classNames, shouldHaveClass);
            } else {
                // node.className ought to be a string.
                toggleObjectClassPropertyString(node, 'className', classNames, shouldHaveClass);
            }
        }
    }

    function toggleObjectClassPropertyString(obj, prop, classNames, shouldHaveClass) {
        // obj/prop is either a node/'className' or a SVGAnimatedString/'baseVal'.
        var currentClassNames = obj[prop].match(cssClassNameRegex) || [];
        ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
            ko.utils.addOrRemoveItem(currentClassNames, className, shouldHaveClass);
        });
        obj[prop] = currentClassNames.join(" ");
    }

    return {
        fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

        arrayForEach: function (array, action) {
            for (var i = 0, j = array.length; i < j; i++)
                action(array[i], i);
        },

        arrayIndexOf: function (array, item) {
            if (typeof Array.prototype.indexOf == "function")
                return Array.prototype.indexOf.call(array, item);
            for (var i = 0, j = array.length; i < j; i++)
                if (array[i] === item)
                    return i;
            return -1;
        },

        arrayFirst: function (array, predicate, predicateOwner) {
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate.call(predicateOwner, array[i], i))
                    return array[i];
            return null;
        },

        arrayRemoveItem: function (array, itemToRemove) {
            var index = ko.utils.arrayIndexOf(array, itemToRemove);
            if (index > 0) {
                array.splice(index, 1);
            }
            else if (index === 0) {
                array.shift();
            }
        },

        arrayGetDistinctValues: function (array) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(result, array[i]) < 0)
                    result.push(array[i]);
            }
            return result;
        },

        arrayMap: function (array, mapping) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                result.push(mapping(array[i], i));
            return result;
        },

        arrayFilter: function (array, predicate) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate(array[i], i))
                    result.push(array[i]);
            return result;
        },

        arrayPushAll: function (array, valuesToPush) {
            if (valuesToPush instanceof Array)
                array.push.apply(array, valuesToPush);
            else
                for (var i = 0, j = valuesToPush.length; i < j; i++)
                    array.push(valuesToPush[i]);
            return array;
        },

        addOrRemoveItem: function(array, value, included) {
            var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.peekObservable(array), value);
            if (existingEntryIndex < 0) {
                if (included)
                    array.push(value);
            } else {
                if (!included)
                    array.splice(existingEntryIndex, 1);
            }
        },

        canSetPrototype: canSetPrototype,

        extend: extend,

        setPrototypeOf: setPrototypeOf,

        setPrototypeOfOrExtend: canSetPrototype ? setPrototypeOf : extend,

        objectForEach: objectForEach,

        objectMap: function(source, mapping) {
            if (!source)
                return source;
            var target = {};
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    target[prop] = mapping(source[prop], prop, source);
                }
            }
            return target;
        },

        emptyDomNode: function (domNode) {
            while (domNode.firstChild) {
                ko.removeNode(domNode.firstChild);
            }
        },

        moveCleanedNodesToContainerElement: function(nodes) {
            // Ensure it's a real array, as we're about to reparent the nodes and
            // we don't want the underlying collection to change while we're doing that.
            var nodesArray = ko.utils.makeArray(nodes);
            var templateDocument = (nodesArray[0] && nodesArray[0].ownerDocument) || document;

            var container = templateDocument.createElement('div');
            for (var i = 0, j = nodesArray.length; i < j; i++) {
                container.appendChild(ko.cleanNode(nodesArray[i]));
            }
            return container;
        },

        cloneNodes: function (nodesArray, shouldCleanNodes) {
            for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
                var clonedNode = nodesArray[i].cloneNode(true);
                newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
            }
            return newNodesArray;
        },

        setDomNodeChildren: function (domNode, childNodes) {
            ko.utils.emptyDomNode(domNode);
            if (childNodes) {
                for (var i = 0, j = childNodes.length; i < j; i++)
                    domNode.appendChild(childNodes[i]);
            }
        },

        replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
            var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
            if (nodesToReplaceArray.length > 0) {
                var insertionPoint = nodesToReplaceArray[0];
                var parent = insertionPoint.parentNode;
                for (var i = 0, j = newNodesArray.length; i < j; i++)
                    parent.insertBefore(newNodesArray[i], insertionPoint);
                for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                    ko.removeNode(nodesToReplaceArray[i]);
                }
            }
        },

        fixUpContinuousNodeArray: function(continuousNodeArray, parentNode) {
            // Before acting on a set of nodes that were previously outputted by a template function, we have to reconcile
            // them against what is in the DOM right now. It may be that some of the nodes have already been removed, or that
            // new nodes might have been inserted in the middle, for example by a binding. Also, there may previously have been
            // leading comment nodes (created by rewritten string-based templates) that have since been removed during binding.
            // So, this function translates the old "map" output array into its best guess of the set of current DOM nodes.
            //
            // Rules:
            //   [A] Any leading nodes that have been removed should be ignored
            //       These most likely correspond to memoization nodes that were already removed during binding
            //       See https://github.com/knockout/knockout/pull/440
            //   [B] Any trailing nodes that have been remove should be ignored
            //       This prevents the code here from adding unrelated nodes to the array while processing rule [C]
            //       See https://github.com/knockout/knockout/pull/1903
            //   [C] We want to output a continuous series of nodes. So, ignore any nodes that have already been removed,
            //       and include any nodes that have been inserted among the previous collection

            if (continuousNodeArray.length) {
                // The parent node can be a virtual element; so get the real parent node
                parentNode = (parentNode.nodeType === 8 && parentNode.parentNode) || parentNode;

                // Rule [A]
                while (continuousNodeArray.length && continuousNodeArray[0].parentNode !== parentNode)
                    continuousNodeArray.splice(0, 1);

                // Rule [B]
                while (continuousNodeArray.length > 1 && continuousNodeArray[continuousNodeArray.length - 1].parentNode !== parentNode)
                    continuousNodeArray.length--;

                // Rule [C]
                if (continuousNodeArray.length > 1) {
                    var current = continuousNodeArray[0], last = continuousNodeArray[continuousNodeArray.length - 1];
                    // Replace with the actual new continuous node set
                    continuousNodeArray.length = 0;
                    while (current !== last) {
                        continuousNodeArray.push(current);
                        current = current.nextSibling;
                    }
                    continuousNodeArray.push(last);
                }
            }
            return continuousNodeArray;
        },

        setOptionNodeSelectionState: function (optionNode, isSelected) {
            // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
            if (ieVersion < 7)
                optionNode.setAttribute("selected", isSelected);
            else
                optionNode.selected = isSelected;
        },

        stringTrim: function (string) {
            return string === null || string === undefined ? '' :
                string.trim ?
                    string.trim() :
                    string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
        },

        stringStartsWith: function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        },

        domNodeIsContainedBy: function (node, containedByNode) {
            if (node === containedByNode)
                return true;
            if (node.nodeType === 11)
                return false; // Fixes issue #1162 - can't use node.contains for document fragments on IE8
            if (containedByNode.contains)
                return containedByNode.contains(node.nodeType === 3 ? node.parentNode : node);
            if (containedByNode.compareDocumentPosition)
                return (containedByNode.compareDocumentPosition(node) & 16) == 16;
            while (node && node != containedByNode) {
                node = node.parentNode;
            }
            return !!node;
        },

        domNodeIsAttachedToDocument: function (node) {
            return ko.utils.domNodeIsContainedBy(node, node.ownerDocument.documentElement);
        },

        anyDomNodeIsAttachedToDocument: function(nodes) {
            return !!ko.utils.arrayFirst(nodes, ko.utils.domNodeIsAttachedToDocument);
        },

        tagNameLower: function(element) {
            // For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
            // Possible future optimization: If we know it's an element from an XHTML document (not HTML),
            // we don't need to do the .toLowerCase() as it will always be lower case anyway.
            return element && element.tagName && element.tagName.toLowerCase();
        },

        catchFunctionErrors: function (delegate) {
            return ko['onError'] ? function () {
                try {
                    return delegate.apply(this, arguments);
                } catch (e) {
                    ko['onError'] && ko['onError'](e);
                    throw e;
                }
            } : delegate;
        },

        setTimeout: function (handler, timeout) {
            return setTimeout(ko.utils.catchFunctionErrors(handler), timeout);
        },

        deferError: function (error) {
            setTimeout(function () {
                ko['onError'] && ko['onError'](error);
                throw error;
            }, 0);
        },

        registerEventHandler: function (element, eventType, handler) {
            var wrappedHandler = ko.utils.catchFunctionErrors(handler);

            var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
            if (!ko.options['useOnlyNativeEvents'] && !mustUseAttachEvent && jQueryInstance) {
                jQueryInstance(element)['bind'](eventType, wrappedHandler);
            } else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
                element.addEventListener(eventType, wrappedHandler, false);
            else if (typeof element.attachEvent != "undefined") {
                var attachEventHandler = function (event) { wrappedHandler.call(element, event); },
                    attachEventName = "on" + eventType;
                element.attachEvent(attachEventName, attachEventHandler);

                // IE does not dispose attachEvent handlers automatically (unlike with addEventListener)
                // so to avoid leaks, we have to remove them manually. See bug #856
                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    element.detachEvent(attachEventName, attachEventHandler);
                });
            } else
                throw new Error("Browser doesn't support addEventListener or attachEvent");
        },

        triggerEvent: function (element, eventType) {
            if (!(element && element.nodeType))
                throw new Error("element must be a DOM node when calling triggerEvent");

            // For click events on checkboxes and radio buttons, jQuery toggles the element checked state *after* the
            // event handler runs instead of *before*. (This was fixed in 1.9 for checkboxes but not for radio buttons.)
            // IE doesn't change the checked state when you trigger the click event using "fireEvent".
            // In both cases, we'll use the click method instead.
            var useClickWorkaround = isClickOnCheckableElement(element, eventType);

            if (!ko.options['useOnlyNativeEvents'] && jQueryInstance && !useClickWorkaround) {
                jQueryInstance(element)['trigger'](eventType);
            } else if (typeof document.createEvent == "function") {
                if (typeof element.dispatchEvent == "function") {
                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                    var event = document.createEvent(eventCategory);
                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                    element.dispatchEvent(event);
                }
                else
                    throw new Error("The supplied element doesn't support dispatchEvent");
            } else if (useClickWorkaround && element.click) {
                element.click();
            } else if (typeof element.fireEvent != "undefined") {
                element.fireEvent("on" + eventType);
            } else {
                throw new Error("Browser doesn't support triggering events");
            }
        },

        unwrapObservable: function (value) {
            return ko.isObservable(value) ? value() : value;
        },

        peekObservable: function (value) {
            return ko.isObservable(value) ? value.peek() : value;
        },

        toggleDomNodeCssClass: toggleDomNodeCssClass,

        setTextContent: function(element, textContent) {
            var value = ko.utils.unwrapObservable(textContent);
            if ((value === null) || (value === undefined))
                value = "";

            // We need there to be exactly one child: a text node.
            // If there are no children, more than one, or if it's not a text node,
            // we'll clear everything and create a single text node.
            var innerTextNode = ko.virtualElements.firstChild(element);
            if (!innerTextNode || innerTextNode.nodeType != 3 || ko.virtualElements.nextSibling(innerTextNode)) {
                ko.virtualElements.setDomNodeChildren(element, [element.ownerDocument.createTextNode(value)]);
            } else {
                innerTextNode.data = value;
            }

            ko.utils.forceRefresh(element);
        },

        setElementName: function(element, name) {
            element.name = name;

            // Workaround IE 6/7 issue
            // - https://github.com/SteveSanderson/knockout/issues/197
            // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
            if (ieVersion <= 7) {
                try {
                    element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
                }
                catch(e) {} // For IE9 with doc mode "IE9 Standards" and browser mode "IE9 Compatibility View"
            }
        },

        forceRefresh: function(node) {
            // Workaround for an IE9 rendering bug - https://github.com/SteveSanderson/knockout/issues/209
            if (ieVersion >= 9) {
                // For text nodes and comment nodes (most likely virtual elements), we will have to refresh the container
                var elem = node.nodeType == 1 ? node : node.parentNode;
                if (elem.style)
                    elem.style.zoom = elem.style.zoom;
            }
        },

        ensureSelectElementIsRenderedCorrectly: function(selectElement) {
            // Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
            // (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
            // Also fixes IE7 and IE8 bug that causes selects to be zero width if enclosed by 'if' or 'with'. (See issue #839)
            if (ieVersion) {
                var originalWidth = selectElement.style.width;
                selectElement.style.width = 0;
                selectElement.style.width = originalWidth;
            }
        },

        range: function (min, max) {
            min = ko.utils.unwrapObservable(min);
            max = ko.utils.unwrapObservable(max);
            var result = [];
            for (var i = min; i <= max; i++)
                result.push(i);
            return result;
        },

        makeArray: function(arrayLikeObject) {
            var result = [];
            for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                result.push(arrayLikeObject[i]);
            }
            return result;
        },

        createSymbolOrString: function(identifier) {
            return canUseSymbols ? Symbol(identifier) : identifier;
        },

        isIe6 : isIe6,
        isIe7 : isIe7,
        ieVersion : ieVersion,

        getFormFields: function(form, fieldName) {
            var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
            var isMatchingField = (typeof fieldName == 'string')
                ? function(field) { return field.name === fieldName }
                : function(field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
            var matches = [];
            for (var i = fields.length - 1; i >= 0; i--) {
                if (isMatchingField(fields[i]))
                    matches.push(fields[i]);
            }
            return matches;
        },

        parseJson: function (jsonString) {
            if (typeof jsonString == "string") {
                jsonString = ko.utils.stringTrim(jsonString);
                if (jsonString) {
                    if (JSON && JSON.parse) // Use native parsing where available
                        return JSON.parse(jsonString);
                    return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                }
            }
            return null;
        },

        stringifyJson: function (data, replacer, space) {   // replacer and space are optional
            if (!JSON || !JSON.stringify)
                throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
            return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
        },

        postJson: function (urlOrForm, data, options) {
            options = options || {};
            var params = options['params'] || {};
            var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
            var url = urlOrForm;

            // If we were given a form, use its 'action' URL and pick out any requested field values
            if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
                var originalForm = urlOrForm;
                url = originalForm.action;
                for (var i = includeFields.length - 1; i >= 0; i--) {
                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                    for (var j = fields.length - 1; j >= 0; j--)
                        params[fields[j].name] = fields[j].value;
                }
            }

            data = ko.utils.unwrapObservable(data);
            var form = document.createElement("form");
            form.style.display = "none";
            form.action = url;
            form.method = "post";
            for (var key in data) {
                // Since 'data' this is a model object, we include all properties including those inherited from its prototype
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                form.appendChild(input);
            }
            objectForEach(params, function(key, value) {
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });
            document.body.appendChild(form);
            options['submitter'] ? options['submitter'](form) : form.submit();
            setTimeout(function () { form.parentNode.removeChild(form); }, 0);
        }
    }
}());

ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);
ko.exportSymbol('utils.objectForEach', ko.utils.objectForEach);
ko.exportSymbol('utils.addOrRemoveItem', ko.utils.addOrRemoveItem);
ko.exportSymbol('utils.setTextContent', ko.utils.setTextContent);
ko.exportSymbol('unwrap', ko.utils.unwrapObservable); // Convenient shorthand, because this is used so commonly

if (!Function.prototype['bind']) {
    // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
    // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
    Function.prototype['bind'] = function (object) {
        var originalFunction = this;
        if (arguments.length === 1) {
            return function () {
                return originalFunction.apply(object, arguments);
            };
        } else {
            var partialArgs = Array.prototype.slice.call(arguments, 1);
            return function () {
                var args = partialArgs.slice(0);
                args.push.apply(args, arguments);
                return originalFunction.apply(object, args);
            };
        }
    };
}

ko.utils.domData = new (function () {
    var uniqueId = 0;
    var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
    var dataStore = {};

    function getAll(node, createIfNotFound) {
        var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
        var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null") && dataStore[dataStoreKey];
        if (!hasExistingDataStore) {
            if (!createIfNotFound)
                return undefined;
            dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
            dataStore[dataStoreKey] = {};
        }
        return dataStore[dataStoreKey];
    }

    return {
        get: function (node, key) {
            var allDataForNode = getAll(node, false);
            return allDataForNode === undefined ? undefined : allDataForNode[key];
        },
        set: function (node, key, value) {
            if (value === undefined) {
                // Make sure we don't actually create a new domData key if we are actually deleting a value
                if (getAll(node, false) === undefined)
                    return;
            }
            var allDataForNode = getAll(node, true);
            allDataForNode[key] = value;
        },
        clear: function (node) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            if (dataStoreKey) {
                delete dataStore[dataStoreKey];
                node[dataStoreKeyExpandoPropertyName] = null;
                return true; // Exposing "did clean" flag purely so specs can infer whether things have been cleaned up as intended
            }
            return false;
        },

        nextKey: function () {
            return (uniqueId++) + dataStoreKeyExpandoPropertyName;
        }
    };
})();

ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully

ko.utils.domNodeDisposal = new (function () {
    var domDataKey = ko.utils.domData.nextKey();
    var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
    var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

    function getDisposeCallbacksCollection(node, createIfNotFound) {
        var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
        if ((allDisposeCallbacks === undefined) && createIfNotFound) {
            allDisposeCallbacks = [];
            ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
        }
        return allDisposeCallbacks;
    }
    function destroyCallbacksCollection(node) {
        ko.utils.domData.set(node, domDataKey, undefined);
    }

    function cleanSingleNode(node) {
        // Run all the dispose callbacks
        var callbacks = getDisposeCallbacksCollection(node, false);
        if (callbacks) {
            callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
            for (var i = 0; i < callbacks.length; i++)
                callbacks[i](node);
        }

        // Erase the DOM data
        ko.utils.domData.clear(node);

        // Perform cleanup needed by external libraries (currently only jQuery, but can be extended)
        ko.utils.domNodeDisposal["cleanExternalData"](node);

        // Clear any immediate-child comment nodes, as these wouldn't have been found by
        // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
        if (cleanableNodeTypesWithDescendants[node.nodeType])
            cleanImmediateCommentTypeChildren(node);
    }

    function cleanImmediateCommentTypeChildren(nodeWithChildren) {
        var child, nextChild = nodeWithChildren.firstChild;
        while (child = nextChild) {
            nextChild = child.nextSibling;
            if (child.nodeType === 8)
                cleanSingleNode(child);
        }
    }

    return {
        addDisposeCallback : function(node, callback) {
            if (typeof callback != "function")
                throw new Error("Callback must be a function");
            getDisposeCallbacksCollection(node, true).push(callback);
        },

        removeDisposeCallback : function(node, callback) {
            var callbacksCollection = getDisposeCallbacksCollection(node, false);
            if (callbacksCollection) {
                ko.utils.arrayRemoveItem(callbacksCollection, callback);
                if (callbacksCollection.length == 0)
                    destroyCallbacksCollection(node);
            }
        },

        cleanNode : function(node) {
            // First clean this node, where applicable
            if (cleanableNodeTypes[node.nodeType]) {
                cleanSingleNode(node);

                // ... then its descendants, where applicable
                if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                    // Clone the descendants list in case it changes during iteration
                    var descendants = [];
                    ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                    for (var i = 0, j = descendants.length; i < j; i++)
                        cleanSingleNode(descendants[i]);
                }
            }
            return node;
        },

        removeNode : function(node) {
            ko.cleanNode(node);
            if (node.parentNode)
                node.parentNode.removeChild(node);
        },

        "cleanExternalData" : function (node) {
            // Special support for jQuery here because it's so commonly used.
            // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
            // so notify it to tear down any resources associated with the node & descendants here.
            if (jQueryInstance && (typeof jQueryInstance['cleanData'] == "function"))
                jQueryInstance['cleanData']([node]);
        }
    };
})();
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
(function () {
    var none = [0, "", ""],
        table = [1, "<table>", "</table>"],
        tbody = [2, "<table><tbody>", "</tbody></table>"],
        tr = [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        select = [1, "<select multiple='multiple'>", "</select>"],
        lookup = {
            'thead': table,
            'tbody': table,
            'tfoot': table,
            'tr': tbody,
            'td': tr,
            'th': tr,
            'option': select,
            'optgroup': select
        },

        // This is needed for old IE if you're *not* using either jQuery or innerShiv. Doesn't affect other cases.
        mayRequireCreateElementHack = ko.utils.ieVersion <= 8;

    function getWrap(tags) {
        var m = tags.match(/^<([a-z]+)[ >]/);
        return (m && lookup[m[1]]) || none;
    }

    function simpleHtmlParse(html, documentContext) {
        documentContext || (documentContext = document);
        var windowContext = documentContext['parentWindow'] || documentContext['defaultView'] || window;

        // Based on jQuery's "clean" function, but only accounting for table-related elements.
        // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly

        // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
        // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
        // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
        // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.

        // Trim whitespace, otherwise indexOf won't work as expected
        var tags = ko.utils.stringTrim(html).toLowerCase(), div = documentContext.createElement("div"),
            wrap = getWrap(tags),
            depth = wrap[0];

        // Go to html and back, then peel off extra wrappers
        // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
        var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
        if (typeof windowContext['innerShiv'] == "function") {
            // Note that innerShiv is deprecated in favour of html5shiv. We should consider adding
            // support for html5shiv (except if no explicit support is needed, e.g., if html5shiv
            // somehow shims the native APIs so it just works anyway)
            div.appendChild(windowContext['innerShiv'](markup));
        } else {
            if (mayRequireCreateElementHack) {
                // The document.createElement('my-element') trick to enable custom elements in IE6-8
                // only works if we assign innerHTML on an element associated with that document.
                documentContext.appendChild(div);
            }

            div.innerHTML = markup;

            if (mayRequireCreateElementHack) {
                div.parentNode.removeChild(div);
            }
        }

        // Move to the right depth
        while (depth--)
            div = div.lastChild;

        return ko.utils.makeArray(div.lastChild.childNodes);
    }

    function jQueryHtmlParse(html, documentContext) {
        // jQuery's "parseHTML" function was introduced in jQuery 1.8.0 and is a documented public API.
        if (jQueryInstance['parseHTML']) {
            return jQueryInstance['parseHTML'](html, documentContext) || []; // Ensure we always return an array and never null
        } else {
            // For jQuery < 1.8.0, we fall back on the undocumented internal "clean" function.
            var elems = jQueryInstance['clean']([html], documentContext);

            // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
            // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
            // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
            if (elems && elems[0]) {
                // Find the top-most parent element that's a direct child of a document fragment
                var elem = elems[0];
                while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
                    elem = elem.parentNode;
                // ... then detach it
                if (elem.parentNode)
                    elem.parentNode.removeChild(elem);
            }

            return elems;
        }
    }

    ko.utils.parseHtmlFragment = function(html, documentContext) {
        return jQueryInstance ?
            jQueryHtmlParse(html, documentContext) :   // As below, benefit from jQuery's optimisations where possible
            simpleHtmlParse(html, documentContext);  // ... otherwise, this simple logic will do in most common cases.
    };

    ko.utils.setHtml = function(node, html) {
        ko.utils.emptyDomNode(node);

        // There's no legitimate reason to display a stringified observable without unwrapping it, so we'll unwrap it
        html = ko.utils.unwrapObservable(html);

        if ((html !== null) && (html !== undefined)) {
            if (typeof html != 'string')
                html = html.toString();

            // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
            // for example <tr> elements which are not normally allowed to exist on their own.
            // If you've referenced jQuery we'll use that rather than duplicating its code.
            if (jQueryInstance) {
                jQueryInstance(node)['html'](html);
            } else {
                // ... otherwise, use KO's own parsing logic.
                var parsedNodes = ko.utils.parseHtmlFragment(html, node.ownerDocument);
                for (var i = 0; i < parsedNodes.length; i++)
                    node.appendChild(parsedNodes[i]);
            }
        }
    };
})();

ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

ko.memoization = (function () {
    var memos = {};

    function randomMax8HexChars() {
        return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    }
    function generateRandomId() {
        return randomMax8HexChars() + randomMax8HexChars();
    }
    function findMemoNodes(rootNode, appendToArray) {
        if (!rootNode)
            return;
        if (rootNode.nodeType == 8) {
            var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
            if (memoId != null)
                appendToArray.push({ domNode: rootNode, memoId: memoId });
        } else if (rootNode.nodeType == 1) {
            for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                findMemoNodes(childNodes[i], appendToArray);
        }
    }

    return {
        memoize: function (callback) {
            if (typeof callback != "function")
                throw new Error("You can only pass a function to ko.memoization.memoize()");
            var memoId = generateRandomId();
            memos[memoId] = callback;
            return "<!--[ko_memo:" + memoId + "]-->";
        },

        unmemoize: function (memoId, callbackParams) {
            var callback = memos[memoId];
            if (callback === undefined)
                throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
            try {
                callback.apply(null, callbackParams || []);
                return true;
            }
            finally { delete memos[memoId]; }
        },

        unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
            var memos = [];
            findMemoNodes(domNode, memos);
            for (var i = 0, j = memos.length; i < j; i++) {
                var node = memos[i].domNode;
                var combinedParams = [node];
                if (extraCallbackParamsArray)
                    ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                if (node.parentNode)
                    node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
            }
        },

        parseMemoText: function (memoText) {
            var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
            return match ? match[1] : null;
        }
    };
})();

ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
ko.tasks = (function () {
    var scheduler,
        taskQueue = [],
        taskQueueLength = 0,
        nextHandle = 1,
        nextIndexToProcess = 0;

    if (window['MutationObserver']) {
        // Chrome 27+, Firefox 14+, IE 11+, Opera 15+, Safari 6.1+
        // From https://github.com/petkaantonov/bluebird * Copyright (c) 2014 Petka Antonov * License: MIT
        scheduler = (function (callback) {
            var div = document.createElement("div");
            new MutationObserver(callback).observe(div, {attributes: true});
            return function () { div.classList.toggle("foo"); };
        })(scheduledProcess);
    } else if (document && "onreadystatechange" in document.createElement("script")) {
        // IE 6-10
        // From https://github.com/YuzuJS/setImmediate * Copyright (c) 2012 Barnesandnoble.com, llc, Donavon West, and Domenic Denicola * License: MIT
        scheduler = function (callback) {
            var script = document.createElement("script");
            script.onreadystatechange = function () {
                script.onreadystatechange = null;
                document.documentElement.removeChild(script);
                script = null;
                callback();
            };
            document.documentElement.appendChild(script);
        };
    } else {
        scheduler = function (callback) {
            setTimeout(callback, 0);
        };
    }

    function processTasks() {
        if (taskQueueLength) {
            // Each mark represents the end of a logical group of tasks and the number of these groups is
            // limited to prevent unchecked recursion.
            var mark = taskQueueLength, countMarks = 0;

            // nextIndexToProcess keeps track of where we are in the queue; processTasks can be called recursively without issue
            for (var task; nextIndexToProcess < taskQueueLength; ) {
                if (task = taskQueue[nextIndexToProcess++]) {
                    if (nextIndexToProcess > mark) {
                        if (++countMarks >= 5000) {
                            nextIndexToProcess = taskQueueLength;   // skip all tasks remaining in the queue since any of them could be causing the recursion
                            ko.utils.deferError(Error("'Too much recursion' after processing " + countMarks + " task groups."));
                            break;
                        }
                        mark = taskQueueLength;
                    }
                    try {
                        task();
                    } catch (ex) {
                        ko.utils.deferError(ex);
                    }
                }
            }
        }
    }

    function scheduledProcess() {
        processTasks();

        // Reset the queue
        nextIndexToProcess = taskQueueLength = taskQueue.length = 0;
    }

    function scheduleTaskProcessing() {
        ko.tasks['scheduler'](scheduledProcess);
    }

    var tasks = {
        'scheduler': scheduler,     // Allow overriding the scheduler

        schedule: function (func) {
            if (!taskQueueLength) {
                scheduleTaskProcessing();
            }

            taskQueue[taskQueueLength++] = func;
            return nextHandle++;
        },

        cancel: function (handle) {
            var index = handle - (nextHandle - taskQueueLength);
            if (index >= nextIndexToProcess && index < taskQueueLength) {
                taskQueue[index] = null;
            }
        },

        // For testing only: reset the queue and return the previous queue length
        'resetForTesting': function () {
            var length = taskQueueLength - nextIndexToProcess;
            nextIndexToProcess = taskQueueLength = taskQueue.length = 0;
            return length;
        },

        runEarly: processTasks
    };

    return tasks;
})();

ko.exportSymbol('tasks', ko.tasks);
ko.exportSymbol('tasks.schedule', ko.tasks.schedule);
//ko.exportSymbol('tasks.cancel', ko.tasks.cancel);  "cancel" isn't minified
ko.exportSymbol('tasks.runEarly', ko.tasks.runEarly);
ko.extenders = {
    'throttle': function(target, timeout) {
        // Throttling means two things:

        // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
        //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
        target['throttleEvaluation'] = timeout;

        // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
        //     so the target cannot change value synchronously or faster than a certain rate
        var writeTimeoutInstance = null;
        return ko.dependentObservable({
            'read': target,
            'write': function(value) {
                clearTimeout(writeTimeoutInstance);
                writeTimeoutInstance = ko.utils.setTimeout(function() {
                    target(value);
                }, timeout);
            }
        });
    },

    'rateLimit': function(target, options) {
        var timeout, method, limitFunction;

        if (typeof options == 'number') {
            timeout = options;
        } else {
            timeout = options['timeout'];
            method = options['method'];
        }

        // rateLimit supersedes deferred updates
        target._deferUpdates = false;

        limitFunction = method == 'notifyWhenChangesStop' ?  debounce : throttle;
        target.limit(function(callback) {
            return limitFunction(callback, timeout);
        });
    },

    'deferred': function(target, options) {
        if (options !== true) {
            throw new Error('The \'deferred\' extender only accepts the value \'true\', because it is not supported to turn deferral off once enabled.')
        }

        if (!target._deferUpdates) {
            target._deferUpdates = true;
            target.limit(function (callback) {
                var handle;
                return function () {
                    ko.tasks.cancel(handle);
                    handle = ko.tasks.schedule(callback);
                    target['notifySubscribers'](undefined, 'dirty');
                };
            });
        }
    },

    'notify': function(target, notifyWhen) {
        target["equalityComparer"] = notifyWhen == "always" ?
            null :  // null equalityComparer means to always notify
            valuesArePrimitiveAndEqual;
    }
};

var primitiveTypes = { 'undefined':1, 'boolean':1, 'number':1, 'string':1 };
function valuesArePrimitiveAndEqual(a, b) {
    var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
    return oldValueIsPrimitive ? (a === b) : false;
}

function throttle(callback, timeout) {
    var timeoutInstance;
    return function () {
        if (!timeoutInstance) {
            timeoutInstance = ko.utils.setTimeout(function () {
                timeoutInstance = undefined;
                callback();
            }, timeout);
        }
    };
}

function debounce(callback, timeout) {
    var timeoutInstance;
    return function () {
        clearTimeout(timeoutInstance);
        timeoutInstance = ko.utils.setTimeout(callback, timeout);
    };
}

function applyExtenders(requestedExtenders) {
    var target = this;
    if (requestedExtenders) {
        ko.utils.objectForEach(requestedExtenders, function(key, value) {
            var extenderHandler = ko.extenders[key];
            if (typeof extenderHandler == 'function') {
                target = extenderHandler(target, value) || target;
            }
        });
    }
    return target;
}

ko.exportSymbol('extenders', ko.extenders);

ko.subscription = function (target, callback, disposeCallback) {
    this._target = target;
    this.callback = callback;
    this.disposeCallback = disposeCallback;
    this.isDisposed = false;
    ko.exportProperty(this, 'dispose', this.dispose);
};
ko.subscription.prototype.dispose = function () {
    this.isDisposed = true;
    this.disposeCallback();
};

ko.subscribable = function () {
    ko.utils.setPrototypeOfOrExtend(this, ko_subscribable_fn);
    ko_subscribable_fn.init(this);
};

var defaultEvent = "change";

// Moved out of "limit" to avoid the extra closure
function limitNotifySubscribers(value, event) {
    if (!event || event === defaultEvent) {
        this._limitChange(value);
    } else if (event === 'beforeChange') {
        this._limitBeforeChange(value);
    } else {
        this._origNotifySubscribers(value, event);
    }
}

var ko_subscribable_fn = {
    init: function(instance) {
        instance._subscriptions = {};
        instance._versionNumber = 1;
    },

    subscribe: function (callback, callbackTarget, event) {
        var self = this;

        event = event || defaultEvent;
        var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

        var subscription = new ko.subscription(self, boundCallback, function () {
            ko.utils.arrayRemoveItem(self._subscriptions[event], subscription);
            if (self.afterSubscriptionRemove)
                self.afterSubscriptionRemove(event);
        });

        if (self.beforeSubscriptionAdd)
            self.beforeSubscriptionAdd(event);

        if (!self._subscriptions[event])
            self._subscriptions[event] = [];
        self._subscriptions[event].push(subscription);

        return subscription;
    },

    "notifySubscribers": function (valueToNotify, event) {
        event = event || defaultEvent;
        if (event === defaultEvent) {
            this.updateVersion();
        }
        if (this.hasSubscriptionsForEvent(event)) {
            try {
                ko.dependencyDetection.begin(); // Begin suppressing dependency detection (by setting the top frame to undefined)
                for (var a = this._subscriptions[event].slice(0), i = 0, subscription; subscription = a[i]; ++i) {
                    // In case a subscription was disposed during the arrayForEach cycle, check
                    // for isDisposed on each subscription before invoking its callback
                    if (!subscription.isDisposed)
                        subscription.callback(valueToNotify);
                }
            } finally {
                ko.dependencyDetection.end(); // End suppressing dependency detection
            }
        }
    },

    getVersion: function () {
        return this._versionNumber;
    },

    hasChanged: function (versionToCheck) {
        return this.getVersion() !== versionToCheck;
    },

    updateVersion: function () {
        ++this._versionNumber;
    },

    limit: function(limitFunction) {
        var self = this, selfIsObservable = ko.isObservable(self),
            ignoreBeforeChange, previousValue, pendingValue, beforeChange = 'beforeChange';

        if (!self._origNotifySubscribers) {
            self._origNotifySubscribers = self["notifySubscribers"];
            self["notifySubscribers"] = limitNotifySubscribers;
        }

        var finish = limitFunction(function() {
            self._notificationIsPending = false;

            // If an observable provided a reference to itself, access it to get the latest value.
            // This allows computed observables to delay calculating their value until needed.
            if (selfIsObservable && pendingValue === self) {
                pendingValue = self();
            }
            ignoreBeforeChange = false;
            if (self.isDifferent(previousValue, pendingValue)) {
                self._origNotifySubscribers(previousValue = pendingValue);
            }
        });

        self._limitChange = function(value) {
            self._notificationIsPending = ignoreBeforeChange = true;
            pendingValue = value;
            finish();
        };
        self._limitBeforeChange = function(value) {
            if (!ignoreBeforeChange) {
                previousValue = value;
                self._origNotifySubscribers(value, beforeChange);
            }
        };
    },

    hasSubscriptionsForEvent: function(event) {
        return this._subscriptions[event] && this._subscriptions[event].length;
    },

    getSubscriptionsCount: function (event) {
        if (event) {
            return this._subscriptions[event] && this._subscriptions[event].length || 0;
        } else {
            var total = 0;
            ko.utils.objectForEach(this._subscriptions, function(eventName, subscriptions) {
                if (eventName !== 'dirty')
                    total += subscriptions.length;
            });
            return total;
        }
    },

    isDifferent: function(oldValue, newValue) {
        return !this['equalityComparer'] || !this['equalityComparer'](oldValue, newValue);
    },

    extend: applyExtenders
};

ko.exportProperty(ko_subscribable_fn, 'subscribe', ko_subscribable_fn.subscribe);
ko.exportProperty(ko_subscribable_fn, 'extend', ko_subscribable_fn.extend);
ko.exportProperty(ko_subscribable_fn, 'getSubscriptionsCount', ko_subscribable_fn.getSubscriptionsCount);

// For browsers that support proto assignment, we overwrite the prototype of each
// observable instance. Since observables are functions, we need Function.prototype
// to still be in the prototype chain.
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko_subscribable_fn, Function.prototype);
}

ko.subscribable['fn'] = ko_subscribable_fn;


ko.isSubscribable = function (instance) {
    return instance != null && typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
};

ko.exportSymbol('subscribable', ko.subscribable);
ko.exportSymbol('isSubscribable', ko.isSubscribable);

ko.computedContext = ko.dependencyDetection = (function () {
    var outerFrames = [],
        currentFrame,
        lastId = 0;

    // Return a unique ID that can be assigned to an observable for dependency tracking.
    // Theoretically, you could eventually overflow the number storage size, resulting
    // in duplicate IDs. But in JavaScript, the largest exact integral value is 2^53
    // or 9,007,199,254,740,992. If you created 1,000,000 IDs per second, it would
    // take over 285 years to reach that number.
    // Reference http://blog.vjeux.com/2010/javascript/javascript-max_int-number-limits.html
    function getId() {
        return ++lastId;
    }

    function begin(options) {
        outerFrames.push(currentFrame);
        currentFrame = options;
    }

    function end() {
        currentFrame = outerFrames.pop();
    }

    return {
        begin: begin,

        end: end,

        registerDependency: function (subscribable) {
            if (currentFrame) {
                if (!ko.isSubscribable(subscribable))
                    throw new Error("Only subscribable things can act as dependencies");
                currentFrame.callback.call(currentFrame.callbackTarget, subscribable, subscribable._id || (subscribable._id = getId()));
            }
        },

        ignore: function (callback, callbackTarget, callbackArgs) {
            try {
                begin();
                return callback.apply(callbackTarget, callbackArgs || []);
            } finally {
                end();
            }
        },

        getDependenciesCount: function () {
            if (currentFrame)
                return currentFrame.computed.getDependenciesCount();
        },

        isInitial: function() {
            if (currentFrame)
                return currentFrame.isInitial;
        }
    };
})();

ko.exportSymbol('computedContext', ko.computedContext);
ko.exportSymbol('computedContext.getDependenciesCount', ko.computedContext.getDependenciesCount);
ko.exportSymbol('computedContext.isInitial', ko.computedContext.isInitial);

ko.exportSymbol('ignoreDependencies', ko.ignoreDependencies = ko.dependencyDetection.ignore);
var observableLatestValue = ko.utils.createSymbolOrString('_latestValue');

ko.observable = function (initialValue) {
    function observable() {
        if (arguments.length > 0) {
            // Write

            // Ignore writes if the value hasn't changed
            if (observable.isDifferent(observable[observableLatestValue], arguments[0])) {
                observable.valueWillMutate();
                observable[observableLatestValue] = arguments[0];
                observable.valueHasMutated();
            }
            return this; // Permits chained assignments
        }
        else {
            // Read
            ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
            return observable[observableLatestValue];
        }
    }

    observable[observableLatestValue] = initialValue;

    // Inherit from 'subscribable'
    if (!ko.utils.canSetPrototype) {
        // 'subscribable' won't be on the prototype chain unless we put it there directly
        ko.utils.extend(observable, ko.subscribable['fn']);
    }
    ko.subscribable['fn'].init(observable);

    // Inherit from 'observable'
    ko.utils.setPrototypeOfOrExtend(observable, observableFn);

    if (ko.options['deferUpdates']) {
        ko.extenders['deferred'](observable, true);
    }

    return observable;
};

// Define prototype for observables
var observableFn = {
    'equalityComparer': valuesArePrimitiveAndEqual,
    peek: function() { return this[observableLatestValue]; },
    valueHasMutated: function () { this['notifySubscribers'](this[observableLatestValue]); },
    valueWillMutate: function () { this['notifySubscribers'](this[observableLatestValue], 'beforeChange'); }
};

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.observable constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(observableFn, ko.subscribable['fn']);
}

var protoProperty = ko.observable.protoProperty = '__ko_proto__';
observableFn[protoProperty] = ko.observable;

ko.hasPrototype = function(instance, prototype) {
    if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
    if (instance[protoProperty] === prototype) return true;
    return ko.hasPrototype(instance[protoProperty], prototype); // Walk the prototype chain
};

ko.isObservable = function (instance) {
    return ko.hasPrototype(instance, ko.observable);
};
ko.isWriteableObservable = function (instance) {
    // Observable
    if ((typeof instance == 'function') && instance[protoProperty] === ko.observable)
        return true;
    // Writeable dependent observable
    if ((typeof instance == 'function') && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction))
        return true;
    // Anything else
    return false;
};

ko.exportSymbol('observable', ko.observable);
ko.exportSymbol('isObservable', ko.isObservable);
ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
ko.exportSymbol('isWritableObservable', ko.isWriteableObservable);
ko.exportSymbol('observable.fn', observableFn);
ko.exportProperty(observableFn, 'peek', observableFn.peek);
ko.exportProperty(observableFn, 'valueHasMutated', observableFn.valueHasMutated);
ko.exportProperty(observableFn, 'valueWillMutate', observableFn.valueWillMutate);
ko.observableArray = function (initialValues) {
    initialValues = initialValues || [];

    if (typeof initialValues != 'object' || !('length' in initialValues))
        throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

    var result = ko.observable(initialValues);
    ko.utils.setPrototypeOfOrExtend(result, ko.observableArray['fn']);
    return result.extend({'trackArrayChanges':true});
};

ko.observableArray['fn'] = {
    'remove': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var removedValues = [];
        var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        for (var i = 0; i < underlyingArray.length; i++) {
            var value = underlyingArray[i];
            if (predicate(value)) {
                if (removedValues.length === 0) {
                    this.valueWillMutate();
                }
                removedValues.push(value);
                underlyingArray.splice(i, 1);
                i--;
            }
        }
        if (removedValues.length) {
            this.valueHasMutated();
        }
        return removedValues;
    },

    'removeAll': function (arrayOfValues) {
        // If you passed zero args, we remove everything
        if (arrayOfValues === undefined) {
            var underlyingArray = this.peek();
            var allValues = underlyingArray.slice(0);
            this.valueWillMutate();
            underlyingArray.splice(0, underlyingArray.length);
            this.valueHasMutated();
            return allValues;
        }
        // If you passed an arg, we interpret it as an array of entries to remove
        if (!arrayOfValues)
            return [];
        return this['remove'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'destroy': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        this.valueWillMutate();
        for (var i = underlyingArray.length - 1; i >= 0; i--) {
            var value = underlyingArray[i];
            if (predicate(value))
                underlyingArray[i]["_destroy"] = true;
        }
        this.valueHasMutated();
    },

    'destroyAll': function (arrayOfValues) {
        // If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return this['destroy'](function() { return true });

        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return this['destroy'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'indexOf': function (item) {
        var underlyingArray = this();
        return ko.utils.arrayIndexOf(underlyingArray, item);
    },

    'replace': function(oldItem, newItem) {
        var index = this['indexOf'](oldItem);
        if (index >= 0) {
            this.valueWillMutate();
            this.peek()[index] = newItem;
            this.valueHasMutated();
        }
    }
};

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.observableArray constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko.observableArray['fn'], ko.observable['fn']);
}

// Populate ko.observableArray.fn with read/write functions from native arrays
// Important: Do not add any additional functions here that may reasonably be used to *read* data from the array
// because we'll eval them without causing subscriptions, so ko.computed output could end up getting stale
ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
        // (for consistency with mutating regular observables)
        var underlyingArray = this.peek();
        this.valueWillMutate();
        this.cacheDiffForKnownOperation(underlyingArray, methodName, arguments);
        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
        this.valueHasMutated();
        // The native sort and reverse methods return a reference to the array, but it makes more sense to return the observable array instead.
        return methodCallResult === underlyingArray ? this : methodCallResult;
    };
});

// Populate ko.observableArray.fn with read-only functions from native arrays
ko.utils.arrayForEach(["slice"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        return underlyingArray[methodName].apply(underlyingArray, arguments);
    };
});

ko.exportSymbol('observableArray', ko.observableArray);
var arrayChangeEventName = 'arrayChange';
ko.extenders['trackArrayChanges'] = function(target, options) {
    // Use the provided options--each call to trackArrayChanges overwrites the previously set options
    target.compareArrayOptions = {};
    if (options && typeof options == "object") {
        ko.utils.extend(target.compareArrayOptions, options);
    }
    target.compareArrayOptions['sparse'] = true;

    // Only modify the target observable once
    if (target.cacheDiffForKnownOperation) {
        return;
    }
    var trackingChanges = false,
        cachedDiff = null,
        arrayChangeSubscription,
        pendingNotifications = 0,
        underlyingNotifySubscribersFunction,
        underlyingBeforeSubscriptionAddFunction = target.beforeSubscriptionAdd,
        underlyingAfterSubscriptionRemoveFunction = target.afterSubscriptionRemove;

    // Watch "subscribe" calls, and for array change events, ensure change tracking is enabled
    target.beforeSubscriptionAdd = function (event) {
        if (underlyingBeforeSubscriptionAddFunction)
            underlyingBeforeSubscriptionAddFunction.call(target, event);
        if (event === arrayChangeEventName) {
            trackChanges();
        }
    };
    // Watch "dispose" calls, and for array change events, ensure change tracking is disabled when all are disposed
    target.afterSubscriptionRemove = function (event) {
        if (underlyingAfterSubscriptionRemoveFunction)
            underlyingAfterSubscriptionRemoveFunction.call(target, event);
        if (event === arrayChangeEventName && !target.hasSubscriptionsForEvent(arrayChangeEventName)) {
            if (underlyingNotifySubscribersFunction) {
                target['notifySubscribers'] = underlyingNotifySubscribersFunction;
                underlyingNotifySubscribersFunction = undefined;
            }
            arrayChangeSubscription.dispose();
            trackingChanges = false;
        }
    };

    function trackChanges() {
        // Calling 'trackChanges' multiple times is the same as calling it once
        if (trackingChanges) {
            return;
        }

        trackingChanges = true;

        // Intercept "notifySubscribers" to track how many times it was called.
        underlyingNotifySubscribersFunction = target['notifySubscribers'];
        target['notifySubscribers'] = function(valueToNotify, event) {
            if (!event || event === defaultEvent) {
                ++pendingNotifications;
            }
            return underlyingNotifySubscribersFunction.apply(this, arguments);
        };

        // Each time the array changes value, capture a clone so that on the next
        // change it's possible to produce a diff
        var previousContents = [].concat(target.peek() || []);
        cachedDiff = null;
        arrayChangeSubscription = target.subscribe(function(currentContents) {
            // Make a copy of the current contents and ensure it's an array
            currentContents = [].concat(currentContents || []);

            // Compute the diff and issue notifications, but only if someone is listening
            if (target.hasSubscriptionsForEvent(arrayChangeEventName)) {
                var changes = getChanges(previousContents, currentContents);
            }

            // Eliminate references to the old, removed items, so they can be GCed
            previousContents = currentContents;
            cachedDiff = null;
            pendingNotifications = 0;

            if (changes && changes.length) {
                target['notifySubscribers'](changes, arrayChangeEventName);
            }
        });
    }

    function getChanges(previousContents, currentContents) {
        // We try to re-use cached diffs.
        // The scenarios where pendingNotifications > 1 are when using rate-limiting or the Deferred Updates
        // plugin, which without this check would not be compatible with arrayChange notifications. Normally,
        // notifications are issued immediately so we wouldn't be queueing up more than one.
        if (!cachedDiff || pendingNotifications > 1) {
            cachedDiff = ko.utils.compareArrays(previousContents, currentContents, target.compareArrayOptions);
        }

        return cachedDiff;
    }

    target.cacheDiffForKnownOperation = function(rawArray, operationName, args) {
        // Only run if we're currently tracking changes for this observable array
        // and there aren't any pending deferred notifications.
        if (!trackingChanges || pendingNotifications) {
            return;
        }
        var diff = [],
            arrayLength = rawArray.length,
            argsLength = args.length,
            offset = 0;

        function pushDiff(status, value, index) {
            return diff[diff.length] = { 'status': status, 'value': value, 'index': index };
        }
        switch (operationName) {
            case 'push':
                offset = arrayLength;
            case 'unshift':
                for (var index = 0; index < argsLength; index++) {
                    pushDiff('added', args[index], offset + index);
                }
                break;

            case 'pop':
                offset = arrayLength - 1;
            case 'shift':
                if (arrayLength) {
                    pushDiff('deleted', rawArray[offset], offset);
                }
                break;

            case 'splice':
                // Negative start index means 'from end of array'. After that we clamp to [0...arrayLength].
                // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
                var startIndex = Math.min(Math.max(0, args[0] < 0 ? arrayLength + args[0] : args[0]), arrayLength),
                    endDeleteIndex = argsLength === 1 ? arrayLength : Math.min(startIndex + (args[1] || 0), arrayLength),
                    endAddIndex = startIndex + argsLength - 2,
                    endIndex = Math.max(endDeleteIndex, endAddIndex),
                    additions = [], deletions = [];
                for (var index = startIndex, argsIndex = 2; index < endIndex; ++index, ++argsIndex) {
                    if (index < endDeleteIndex)
                        deletions.push(pushDiff('deleted', rawArray[index], index));
                    if (index < endAddIndex)
                        additions.push(pushDiff('added', args[argsIndex], index));
                }
                ko.utils.findMovesInArrayComparison(deletions, additions);
                break;

            default:
                return;
        }
        cachedDiff = diff;
    };
};
var computedState = ko.utils.createSymbolOrString('_state');

ko.computed = ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
    if (typeof evaluatorFunctionOrOptions === "object") {
        // Single-parameter syntax - everything is on this "options" param
        options = evaluatorFunctionOrOptions;
    } else {
        // Multi-parameter syntax - construct the options according to the params passed
        options = options || {};
        if (evaluatorFunctionOrOptions) {
            options["read"] = evaluatorFunctionOrOptions;
        }
    }
    if (typeof options["read"] != "function")
        throw Error("Pass a function that returns the value of the ko.computed");

    var writeFunction = options["write"];
    var state = {
        latestValue: undefined,
        isStale: true,
        isBeingEvaluated: false,
        suppressDisposalUntilDisposeWhenReturnsFalse: false,
        isDisposed: false,
        pure: false,
        isSleeping: false,
        readFunction: options["read"],
        evaluatorFunctionTarget: evaluatorFunctionTarget || options["owner"],
        disposeWhenNodeIsRemoved: options["disposeWhenNodeIsRemoved"] || options.disposeWhenNodeIsRemoved || null,
        disposeWhen: options["disposeWhen"] || options.disposeWhen,
        domNodeDisposalCallback: null,
        dependencyTracking: {},
        dependenciesCount: 0,
        evaluationTimeoutInstance: null
    };

    function computedObservable() {
        if (arguments.length > 0) {
            if (typeof writeFunction === "function") {
                // Writing a value
                writeFunction.apply(state.evaluatorFunctionTarget, arguments);
            } else {
                throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
            }
            return this; // Permits chained assignments
        } else {
            // Reading the value
            ko.dependencyDetection.registerDependency(computedObservable);
            if (state.isStale || (state.isSleeping && computedObservable.haveDependenciesChanged())) {
                computedObservable.evaluateImmediate();
            }
            return state.latestValue;
        }
    }

    computedObservable[computedState] = state;
    computedObservable.hasWriteFunction = typeof writeFunction === "function";

    // Inherit from 'subscribable'
    if (!ko.utils.canSetPrototype) {
        // 'subscribable' won't be on the prototype chain unless we put it there directly
        ko.utils.extend(computedObservable, ko.subscribable['fn']);
    }
    ko.subscribable['fn'].init(computedObservable);

    // Inherit from 'computed'
    ko.utils.setPrototypeOfOrExtend(computedObservable, computedFn);

    if (options['pure']) {
        state.pure = true;
        state.isSleeping = true;     // Starts off sleeping; will awake on the first subscription
        ko.utils.extend(computedObservable, pureComputedOverrides);
    } else if (options['deferEvaluation']) {
        ko.utils.extend(computedObservable, deferEvaluationOverrides);
    }

    if (ko.options['deferUpdates']) {
        ko.extenders['deferred'](computedObservable, true);
    }

    if (DEBUG) {
        // #1731 - Aid debugging by exposing the computed's options
        computedObservable["_options"] = options;
    }

    if (state.disposeWhenNodeIsRemoved) {
        // Since this computed is associated with a DOM node, and we don't want to dispose the computed
        // until the DOM node is *removed* from the document (as opposed to never having been in the document),
        // we'll prevent disposal until "disposeWhen" first returns false.
        state.suppressDisposalUntilDisposeWhenReturnsFalse = true;

        // disposeWhenNodeIsRemoved: true can be used to opt into the "only dispose after first false result"
        // behaviour even if there's no specific node to watch. In that case, clear the option so we don't try
        // to watch for a non-node's disposal. This technique is intended for KO's internal use only and shouldn't
        // be documented or used by application code, as it's likely to change in a future version of KO.
        if (!state.disposeWhenNodeIsRemoved.nodeType) {
            state.disposeWhenNodeIsRemoved = null;
        }
    }

    // Evaluate, unless sleeping or deferEvaluation is true
    if (!state.isSleeping && !options['deferEvaluation']) {
        computedObservable.evaluateImmediate();
    }

    // Attach a DOM node disposal callback so that the computed will be proactively disposed as soon as the node is
    // removed using ko.removeNode. But skip if isActive is false (there will never be any dependencies to dispose).
    if (state.disposeWhenNodeIsRemoved && computedObservable.isActive()) {
        ko.utils.domNodeDisposal.addDisposeCallback(state.disposeWhenNodeIsRemoved, state.domNodeDisposalCallback = function () {
            computedObservable.dispose();
        });
    }

    return computedObservable;
};

// Utility function that disposes a given dependencyTracking entry
function computedDisposeDependencyCallback(id, entryToDispose) {
    if (entryToDispose !== null && entryToDispose.dispose) {
        entryToDispose.dispose();
    }
}

// This function gets called each time a dependency is detected while evaluating a computed.
// It's factored out as a shared function to avoid creating unnecessary function instances during evaluation.
function computedBeginDependencyDetectionCallback(subscribable, id) {
    var computedObservable = this.computedObservable,
        state = computedObservable[computedState];
    if (!state.isDisposed) {
        if (this.disposalCount && this.disposalCandidates[id]) {
            // Don't want to dispose this subscription, as it's still being used
            computedObservable.addDependencyTracking(id, subscribable, this.disposalCandidates[id]);
            this.disposalCandidates[id] = null; // No need to actually delete the property - disposalCandidates is a transient object anyway
            --this.disposalCount;
        } else if (!state.dependencyTracking[id]) {
            // Brand new subscription - add it
            computedObservable.addDependencyTracking(id, subscribable, state.isSleeping ? { _target: subscribable } : computedObservable.subscribeToDependency(subscribable));
        }
    }
}

var computedFn = {
    "equalityComparer": valuesArePrimitiveAndEqual,
    getDependenciesCount: function () {
        return this[computedState].dependenciesCount;
    },
    addDependencyTracking: function (id, target, trackingObj) {
        if (this[computedState].pure && target === this) {
            throw Error("A 'pure' computed must not be called recursively");
        }

        this[computedState].dependencyTracking[id] = trackingObj;
        trackingObj._order = this[computedState].dependenciesCount++;
        trackingObj._version = target.getVersion();
    },
    haveDependenciesChanged: function () {
        var id, dependency, dependencyTracking = this[computedState].dependencyTracking;
        for (id in dependencyTracking) {
            if (dependencyTracking.hasOwnProperty(id)) {
                dependency = dependencyTracking[id];
                if (dependency._target.hasChanged(dependency._version)) {
                    return true;
                }
            }
        }
    },
    markDirty: function () {
        // Process "dirty" events if we can handle delayed notifications
        if (this._evalDelayed && !this[computedState].isBeingEvaluated) {
            this._evalDelayed();
        }
    },
    isActive: function () {
        return this[computedState].isStale || this[computedState].dependenciesCount > 0;
    },
    respondToChange: function () {
        // Ignore "change" events if we've already scheduled a delayed notification
        if (!this._notificationIsPending) {
            this.evaluatePossiblyAsync();
        }
    },
    subscribeToDependency: function (target) {
        if (target._deferUpdates && !this[computedState].disposeWhenNodeIsRemoved) {
            var dirtySub = target.subscribe(this.markDirty, this, 'dirty'),
                changeSub = target.subscribe(this.respondToChange, this);
            return {
                _target: target,
                dispose: function () {
                    dirtySub.dispose();
                    changeSub.dispose();
                }
            };
        } else {
            return target.subscribe(this.evaluatePossiblyAsync, this);
        }
    },
    evaluatePossiblyAsync: function () {
        var computedObservable = this,
            throttleEvaluationTimeout = computedObservable['throttleEvaluation'];
        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
            clearTimeout(this[computedState].evaluationTimeoutInstance);
            this[computedState].evaluationTimeoutInstance = ko.utils.setTimeout(function () {
                computedObservable.evaluateImmediate(true /*notifyChange*/);
            }, throttleEvaluationTimeout);
        } else if (computedObservable._evalDelayed) {
            computedObservable._evalDelayed();
        } else {
            computedObservable.evaluateImmediate(true /*notifyChange*/);
        }
    },
    evaluateImmediate: function (notifyChange) {
        var computedObservable = this,
            state = computedObservable[computedState],
            disposeWhen = state.disposeWhen,
            changed = false;

        if (state.isBeingEvaluated) {
            // If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
            // This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
            // certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
            // their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
            return;
        }

        // Do not evaluate (and possibly capture new dependencies) if disposed
        if (state.isDisposed) {
            return;
        }

        if (state.disposeWhenNodeIsRemoved && !ko.utils.domNodeIsAttachedToDocument(state.disposeWhenNodeIsRemoved) || disposeWhen && disposeWhen()) {
            // See comment above about suppressDisposalUntilDisposeWhenReturnsFalse
            if (!state.suppressDisposalUntilDisposeWhenReturnsFalse) {
                computedObservable.dispose();
                return;
            }
        } else {
            // It just did return false, so we can stop suppressing now
            state.suppressDisposalUntilDisposeWhenReturnsFalse = false;
        }

        state.isBeingEvaluated = true;
        try {
            changed = this.evaluateImmediate_CallReadWithDependencyDetection(notifyChange);
        } finally {
            state.isBeingEvaluated = false;
        }

        if (!state.dependenciesCount) {
            computedObservable.dispose();
        }

        return changed;
    },
    evaluateImmediate_CallReadWithDependencyDetection: function (notifyChange) {
        // This function is really just part of the evaluateImmediate logic. You would never call it from anywhere else.
        // Factoring it out into a separate function means it can be independent of the try/catch block in evaluateImmediate,
        // which contributes to saving about 40% off the CPU overhead of computed evaluation (on V8 at least).

        var computedObservable = this,
            state = computedObservable[computedState],
            changed = false;

        // Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
        // Then, during evaluation, we cross off any that are in fact still being used.
        var isInitial = state.pure ? undefined : !state.dependenciesCount,   // If we're evaluating when there are no previous dependencies, it must be the first time
            dependencyDetectionContext = {
                computedObservable: computedObservable,
                disposalCandidates: state.dependencyTracking,
                disposalCount: state.dependenciesCount
            };

        ko.dependencyDetection.begin({
            callbackTarget: dependencyDetectionContext,
            callback: computedBeginDependencyDetectionCallback,
            computed: computedObservable,
            isInitial: isInitial
        });

        state.dependencyTracking = {};
        state.dependenciesCount = 0;

        var newValue = this.evaluateImmediate_CallReadThenEndDependencyDetection(state, dependencyDetectionContext);

        if (computedObservable.isDifferent(state.latestValue, newValue)) {
            if (!state.isSleeping) {
                computedObservable["notifySubscribers"](state.latestValue, "beforeChange");
            }

            state.latestValue = newValue;
            if (DEBUG) computedObservable._latestValue = newValue;

            if (state.isSleeping) {
                computedObservable.updateVersion();
            } else if (notifyChange) {
                computedObservable["notifySubscribers"](state.latestValue);
            }

            changed = true;
        }

        if (isInitial) {
            computedObservable["notifySubscribers"](state.latestValue, "awake");
        }

        return changed;
    },
    evaluateImmediate_CallReadThenEndDependencyDetection: function (state, dependencyDetectionContext) {
        // This function is really part of the evaluateImmediate_CallReadWithDependencyDetection logic.
        // You'd never call it from anywhere else. Factoring it out means that evaluateImmediate_CallReadWithDependencyDetection
        // can be independent of try/finally blocks, which contributes to saving about 40% off the CPU
        // overhead of computed evaluation (on V8 at least).

        try {
            var readFunction = state.readFunction;
            return state.evaluatorFunctionTarget ? readFunction.call(state.evaluatorFunctionTarget) : readFunction();
        } finally {
            ko.dependencyDetection.end();

            // For each subscription no longer being used, remove it from the active subscriptions list and dispose it
            if (dependencyDetectionContext.disposalCount && !state.isSleeping) {
                ko.utils.objectForEach(dependencyDetectionContext.disposalCandidates, computedDisposeDependencyCallback);
            }

            state.isStale = false;
        }
    },
    peek: function () {
        // Peek won't re-evaluate, except while the computed is sleeping or to get the initial value when "deferEvaluation" is set.
        var state = this[computedState];
        if ((state.isStale && !state.dependenciesCount) || (state.isSleeping && this.haveDependenciesChanged())) {
            this.evaluateImmediate();
        }
        return state.latestValue;
    },
    limit: function (limitFunction) {
        // Override the limit function with one that delays evaluation as well
        ko.subscribable['fn'].limit.call(this, limitFunction);
        this._evalDelayed = function () {
            this._limitBeforeChange(this[computedState].latestValue);

            this[computedState].isStale = true; // Mark as dirty

            // Pass the observable to the "limit" code, which will access it when
            // it's time to do the notification.
            this._limitChange(this);
        };
    },
    dispose: function () {
        var state = this[computedState];
        if (!state.isSleeping && state.dependencyTracking) {
            ko.utils.objectForEach(state.dependencyTracking, function (id, dependency) {
                if (dependency.dispose)
                    dependency.dispose();
            });
        }
        if (state.disposeWhenNodeIsRemoved && state.domNodeDisposalCallback) {
            ko.utils.domNodeDisposal.removeDisposeCallback(state.disposeWhenNodeIsRemoved, state.domNodeDisposalCallback);
        }
        state.dependencyTracking = null;
        state.dependenciesCount = 0;
        state.isDisposed = true;
        state.isStale = false;
        state.isSleeping = false;
        state.disposeWhenNodeIsRemoved = null;
    }
};

var pureComputedOverrides = {
    beforeSubscriptionAdd: function (event) {
        // If asleep, wake up the computed by subscribing to any dependencies.
        var computedObservable = this,
            state = computedObservable[computedState];
        if (!state.isDisposed && state.isSleeping && event == 'change') {
            state.isSleeping = false;
            if (state.isStale || computedObservable.haveDependenciesChanged()) {
                state.dependencyTracking = null;
                state.dependenciesCount = 0;
                state.isStale = true;
                if (computedObservable.evaluateImmediate()) {
                    computedObservable.updateVersion();
                }
            } else {
                // First put the dependencies in order
                var dependeciesOrder = [];
                ko.utils.objectForEach(state.dependencyTracking, function (id, dependency) {
                    dependeciesOrder[dependency._order] = id;
                });
                // Next, subscribe to each one
                ko.utils.arrayForEach(dependeciesOrder, function (id, order) {
                    var dependency = state.dependencyTracking[id],
                        subscription = computedObservable.subscribeToDependency(dependency._target);
                    subscription._order = order;
                    subscription._version = dependency._version;
                    state.dependencyTracking[id] = subscription;
                });
            }
            if (!state.isDisposed) {     // test since evaluating could trigger disposal
                computedObservable["notifySubscribers"](state.latestValue, "awake");
            }
        }
    },
    afterSubscriptionRemove: function (event) {
        var state = this[computedState];
        if (!state.isDisposed && event == 'change' && !this.hasSubscriptionsForEvent('change')) {
            ko.utils.objectForEach(state.dependencyTracking, function (id, dependency) {
                if (dependency.dispose) {
                    state.dependencyTracking[id] = {
                        _target: dependency._target,
                        _order: dependency._order,
                        _version: dependency._version
                    };
                    dependency.dispose();
                }
            });
            state.isSleeping = true;
            this["notifySubscribers"](undefined, "asleep");
        }
    },
    getVersion: function () {
        // Because a pure computed is not automatically updated while it is sleeping, we can't
        // simply return the version number. Instead, we check if any of the dependencies have
        // changed and conditionally re-evaluate the computed observable.
        var state = this[computedState];
        if (state.isSleeping && (state.isStale || this.haveDependenciesChanged())) {
            this.evaluateImmediate();
        }
        return ko.subscribable['fn'].getVersion.call(this);
    }
};

var deferEvaluationOverrides = {
    beforeSubscriptionAdd: function (event) {
        // This will force a computed with deferEvaluation to evaluate when the first subscription is registered.
        if (event == 'change' || event == 'beforeChange') {
            this.peek();
        }
    }
};

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.computed constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(computedFn, ko.subscribable['fn']);
}

// Set the proto chain values for ko.hasPrototype
var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
ko.computed[protoProp] = ko.observable;
computedFn[protoProp] = ko.computed;

ko.isComputed = function (instance) {
    return ko.hasPrototype(instance, ko.computed);
};

ko.isPureComputed = function (instance) {
    return ko.hasPrototype(instance, ko.computed)
        && instance[computedState] && instance[computedState].pure;
};

ko.exportSymbol('computed', ko.computed);
ko.exportSymbol('dependentObservable', ko.computed);    // export ko.dependentObservable for backwards compatibility (1.x)
ko.exportSymbol('isComputed', ko.isComputed);
ko.exportSymbol('isPureComputed', ko.isPureComputed);
ko.exportSymbol('computed.fn', computedFn);
ko.exportProperty(computedFn, 'peek', computedFn.peek);
ko.exportProperty(computedFn, 'dispose', computedFn.dispose);
ko.exportProperty(computedFn, 'isActive', computedFn.isActive);
ko.exportProperty(computedFn, 'getDependenciesCount', computedFn.getDependenciesCount);

ko.pureComputed = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget) {
    if (typeof evaluatorFunctionOrOptions === 'function') {
        return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget, {'pure':true});
    } else {
        evaluatorFunctionOrOptions = ko.utils.extend({}, evaluatorFunctionOrOptions);   // make a copy of the parameter object
        evaluatorFunctionOrOptions['pure'] = true;
        return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget);
    }
};
ko.exportSymbol('pureComputed', ko.pureComputed);

(function() {
    var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)

    ko.toJS = function(rootObject) {
        if (arguments.length == 0)
            throw new Error("When calling ko.toJS, pass the object you want to convert.");

        // We just unwrap everything at every level in the object graph
        return mapJsObjectGraph(rootObject, function(valueToMap) {
            // Loop because an observable's value might in turn be another observable wrapper
            for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
                valueToMap = valueToMap();
            return valueToMap;
        });
    };

    ko.toJSON = function(rootObject, replacer, space) {     // replacer and space are optional
        var plainJavaScriptObject = ko.toJS(rootObject);
        return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
    };

    function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
        visitedObjects = visitedObjects || new objectLookup();

        rootObject = mapInputCallback(rootObject);
        var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof RegExp)) && (!(rootObject instanceof Date)) && (!(rootObject instanceof String)) && (!(rootObject instanceof Number)) && (!(rootObject instanceof Boolean));
        if (!canHaveProperties)
            return rootObject;

        var outputProperties = rootObject instanceof Array ? [] : {};
        visitedObjects.save(rootObject, outputProperties);

        visitPropertiesOrArrayEntries(rootObject, function(indexer) {
            var propertyValue = mapInputCallback(rootObject[indexer]);

            switch (typeof propertyValue) {
                case "boolean":
                case "number":
                case "string":
                case "function":
                    outputProperties[indexer] = propertyValue;
                    break;
                case "object":
                case "undefined":
                    var previouslyMappedValue = visitedObjects.get(propertyValue);
                    outputProperties[indexer] = (previouslyMappedValue !== undefined)
                        ? previouslyMappedValue
                        : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                    break;
            }
        });

        return outputProperties;
    }

    function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
        if (rootObject instanceof Array) {
            for (var i = 0; i < rootObject.length; i++)
                visitorCallback(i);

            // For arrays, also respect toJSON property for custom mappings (fixes #278)
            if (typeof rootObject['toJSON'] == 'function')
                visitorCallback('toJSON');
        } else {
            for (var propertyName in rootObject) {
                visitorCallback(propertyName);
            }
        }
    }

    function objectLookup() {
        this.keys = [];
        this.values = [];
    }

    objectLookup.prototype = {
        constructor: objectLookup,
        save: function(key, value) {
            var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
            if (existingIndex >= 0)
                this.values[existingIndex] = value;
            else {
                this.keys.push(key);
                this.values.push(value);
            }
        },
        get: function(key) {
            var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
            return (existingIndex >= 0) ? this.values[existingIndex] : undefined;
        }
    };
})();

ko.exportSymbol('toJS', ko.toJS);
ko.exportSymbol('toJSON', ko.toJSON);
(function () {
    var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

    // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
    // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
    // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
    ko.selectExtensions = {
        readValue : function(element) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    if (element[hasDomDataExpandoProperty] === true)
                        return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                    return ko.utils.ieVersion <= 7
                        ? (element.getAttributeNode('value') && element.getAttributeNode('value').specified ? element.value : element.text)
                        : element.value;
                case 'select':
                    return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                default:
                    return element.value;
            }
        },

        writeValue: function(element, value, allowUnset) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    switch(typeof value) {
                        case "string":
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                            if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                                delete element[hasDomDataExpandoProperty];
                            }
                            element.value = value;
                            break;
                        default:
                            // Store arbitrary object using DomData
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                            element[hasDomDataExpandoProperty] = true;

                            // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                            element.value = typeof value === "number" ? value : "";
                            break;
                    }
                    break;
                case 'select':
                    if (value === "" || value === null)       // A blank string or null value will select the caption
                        value = undefined;
                    var selection = -1;
                    for (var i = 0, n = element.options.length, optionValue; i < n; ++i) {
                        optionValue = ko.selectExtensions.readValue(element.options[i]);
                        // Include special check to handle selecting a caption with a blank string value
                        if (optionValue == value || (optionValue == "" && value === undefined)) {
                            selection = i;
                            break;
                        }
                    }
                    if (allowUnset || selection >= 0 || (value === undefined && element.size > 1)) {
                        element.selectedIndex = selection;
                    }
                    break;
                default:
                    if ((value === null) || (value === undefined))
                        value = "";
                    element.value = value;
                    break;
            }
        }
    };
})();

ko.exportSymbol('selectExtensions', ko.selectExtensions);
ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);
ko.expressionRewriting = (function () {
    var javaScriptReservedWords = ["true", "false", "null", "undefined"];

    // Matches something that can be assigned to--either an isolated identifier or something ending with a property accessor
    // This is designed to be simple and avoid false negatives, but could produce false positives (e.g., a+b.c).
    // This also will not properly handle nested brackets (e.g., obj1[obj2['prop']]; see #911).
    var javaScriptAssignmentTarget = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;

    function getWriteableValue(expression) {
        if (ko.utils.arrayIndexOf(javaScriptReservedWords, expression) >= 0)
            return false;
        var match = expression.match(javaScriptAssignmentTarget);
        return match === null ? false : match[1] ? ('Object(' + match[1] + ')' + match[2]) : expression;
    }

    // The following regular expressions will be used to split an object-literal string into tokens

        // These two match strings, either with double quotes or single quotes
    var stringDouble = '"(?:[^"\\\\]|\\\\.)*"',
        stringSingle = "'(?:[^'\\\\]|\\\\.)*'",
        // Matches a regular expression (text enclosed by slashes), but will also match sets of divisions
        // as a regular expression (this is handled by the parsing loop below).
        stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*',
        // These characters have special meaning to the parser and must not appear in the middle of a
        // token, except as part of a string.
        specials = ',"\'{}()/:[\\]',
        // Match text (at least two characters) that does not contain any of the above special characters,
        // although some of the special characters are allowed to start it (all but the colon and comma).
        // The text can contain spaces, but leading or trailing spaces are skipped.
        everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']',
        // Match any non-space character not matched already. This will match colons and commas, since they're
        // not matched by "everyThingElse", but will also match any other single character that wasn't already
        // matched (for example: in "a: 1, b: 2", each of the non-space characters will be matched by oneNotSpace).
        oneNotSpace = '[^\\s]',

        // Create the actual regular expression by or-ing the above strings. The order is important.
        bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g'),

        // Match end of previous token to determine whether a slash is a division or regex.
        divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/,
        keywordRegexLookBehind = {'in':1,'return':1,'typeof':1};

    function parseObjectLiteral(objectLiteralString) {
        // Trim leading and trailing spaces from the string
        var str = ko.utils.stringTrim(objectLiteralString);

        // Trim braces '{' surrounding the whole object literal
        if (str.charCodeAt(0) === 123) str = str.slice(1, -1);

        // Split into tokens
        var result = [], toks = str.match(bindingToken), key, values = [], depth = 0;

        if (toks) {
            // Append a comma so that we don't need a separate code block to deal with the last item
            toks.push(',');

            for (var i = 0, tok; tok = toks[i]; ++i) {
                var c = tok.charCodeAt(0);
                // A comma signals the end of a key/value pair if depth is zero
                if (c === 44) { // ","
                    if (depth <= 0) {
                        result.push((key && values.length) ? {key: key, value: values.join('')} : {'unknown': key || values.join('')});
                        key = depth = 0;
                        values = [];
                        continue;
                    }
                // Simply skip the colon that separates the name and value
                } else if (c === 58) { // ":"
                    if (!depth && !key && values.length === 1) {
                        key = values.pop();
                        continue;
                    }
                // A set of slashes is initially matched as a regular expression, but could be division
                } else if (c === 47 && i && tok.length > 1) {  // "/"
                    // Look at the end of the previous token to determine if the slash is actually division
                    var match = toks[i-1].match(divisionLookBehind);
                    if (match && !keywordRegexLookBehind[match[0]]) {
                        // The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
                        str = str.substr(str.indexOf(tok) + 1);
                        toks = str.match(bindingToken);
                        toks.push(',');
                        i = -1;
                        // Continue with just the slash
                        tok = '/';
                    }
                // Increment depth for parentheses, braces, and brackets so that interior commas are ignored
                } else if (c === 40 || c === 123 || c === 91) { // '(', '{', '['
                    ++depth;
                } else if (c === 41 || c === 125 || c === 93) { // ')', '}', ']'
                    --depth;
                // The key will be the first token; if it's a string, trim the quotes
                } else if (!key && !values.length && (c === 34 || c === 39)) { // '"', "'"
                    tok = tok.slice(1, -1);
                }
                values.push(tok);
            }
        }
        return result;
    }

    // Two-way bindings include a write function that allow the handler to update the value even if it's not an observable.
    var twoWayBindings = {};

    function preProcessBindings(bindingsStringOrKeyValueArray, bindingOptions) {
        bindingOptions = bindingOptions || {};

        function processKeyValue(key, val) {
            var writableVal;
            function callPreprocessHook(obj) {
                return (obj && obj['preprocess']) ? (val = obj['preprocess'](val, key, processKeyValue)) : true;
            }
            if (!bindingParams) {
                if (!callPreprocessHook(ko['getBindingHandler'](key)))
                    return;

                if (twoWayBindings[key] && (writableVal = getWriteableValue(val))) {
                    // For two-way bindings, provide a write method in case the value
                    // isn't a writable observable.
                    propertyAccessorResultStrings.push("'" + key + "':function(_z){" + writableVal + "=_z}");
                }
            }
            // Values are wrapped in a function so that each value can be accessed independently
            if (makeValueAccessors) {
                val = 'function(){return ' + val + ' }';
            }
            resultStrings.push("'" + key + "':" + val);
        }

        var resultStrings = [],
            propertyAccessorResultStrings = [],
            makeValueAccessors = bindingOptions['valueAccessors'],
            bindingParams = bindingOptions['bindingParams'],
            keyValueArray = typeof bindingsStringOrKeyValueArray === "string" ?
                parseObjectLiteral(bindingsStringOrKeyValueArray) : bindingsStringOrKeyValueArray;

        ko.utils.arrayForEach(keyValueArray, function(keyValue) {
            processKeyValue(keyValue.key || keyValue['unknown'], keyValue.value);
        });

        if (propertyAccessorResultStrings.length)
            processKeyValue('_ko_property_writers', "{" + propertyAccessorResultStrings.join(",") + " }");

        return resultStrings.join(",");
    }

    return {
        bindingRewriteValidators: [],

        twoWayBindings: twoWayBindings,

        parseObjectLiteral: parseObjectLiteral,

        preProcessBindings: preProcessBindings,

        keyValueArrayContainsKey: function(keyValueArray, key) {
            for (var i = 0; i < keyValueArray.length; i++)
                if (keyValueArray[i]['key'] == key)
                    return true;
            return false;
        },

        // Internal, private KO utility for updating model properties from within bindings
        // property:            If the property being updated is (or might be) an observable, pass it here
        //                      If it turns out to be a writable observable, it will be written to directly
        // allBindings:         An object with a get method to retrieve bindings in the current execution context.
        //                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
        // key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
        // value:               The value to be written
        // checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
        //                      it is !== existing value on that writable observable
        writeValueToProperty: function(property, allBindings, key, value, checkIfDifferent) {
            if (!property || !ko.isObservable(property)) {
                var propWriters = allBindings.get('_ko_property_writers');
                if (propWriters && propWriters[key])
                    propWriters[key](value);
            } else if (ko.isWriteableObservable(property) && (!checkIfDifferent || property.peek() !== value)) {
                property(value);
            }
        }
    };
})();

ko.exportSymbol('expressionRewriting', ko.expressionRewriting);
ko.exportSymbol('expressionRewriting.bindingRewriteValidators', ko.expressionRewriting.bindingRewriteValidators);
ko.exportSymbol('expressionRewriting.parseObjectLiteral', ko.expressionRewriting.parseObjectLiteral);
ko.exportSymbol('expressionRewriting.preProcessBindings', ko.expressionRewriting.preProcessBindings);

// Making bindings explicitly declare themselves as "two way" isn't ideal in the long term (it would be better if
// all bindings could use an official 'property writer' API without needing to declare that they might). However,
// since this is not, and has never been, a public API (_ko_property_writers was never documented), it's acceptable
// as an internal implementation detail in the short term.
// For those developers who rely on _ko_property_writers in their custom bindings, we expose _twoWayBindings as an
// undocumented feature that makes it relatively easy to upgrade to KO 3.0. However, this is still not an official
// public API, and we reserve the right to remove it at any time if we create a real public property writers API.
ko.exportSymbol('expressionRewriting._twoWayBindings', ko.expressionRewriting.twoWayBindings);

// For backward compatibility, define the following aliases. (Previously, these function names were misleading because
// they referred to JSON specifically, even though they actually work with arbitrary JavaScript object literal expressions.)
ko.exportSymbol('jsonExpressionRewriting', ko.expressionRewriting);
ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.expressionRewriting.preProcessBindings);
(function() {
    // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
    // may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
    // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
    // of that virtual hierarchy
    //
    // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
    // without having to scatter special cases all over the binding and templating code.

    // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
    // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
    // So, use node.text where available, and node.nodeValue elsewhere
    var commentNodesHaveTextProperty = document && document.createComment("test").text === "<!--test-->";

    var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko(?:\s+([\s\S]+))?\s*-->$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/;
    var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
    var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

    function isStartComment(node) {
        return (node.nodeType == 8) && startCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
    }

    function isEndComment(node) {
        return (node.nodeType == 8) && endCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
    }

    function getVirtualChildren(startComment, allowUnbalanced) {
        var currentNode = startComment;
        var depth = 1;
        var children = [];
        while (currentNode = currentNode.nextSibling) {
            if (isEndComment(currentNode)) {
                depth--;
                if (depth === 0)
                    return children;
            }

            children.push(currentNode);

            if (isStartComment(currentNode))
                depth++;
        }
        if (!allowUnbalanced)
            throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
        return null;
    }

    function getMatchingEndComment(startComment, allowUnbalanced) {
        var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
        if (allVirtualChildren) {
            if (allVirtualChildren.length > 0)
                return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
            return startComment.nextSibling;
        } else
            return null; // Must have no matching end comment, and allowUnbalanced is true
    }

    function getUnbalancedChildTags(node) {
        // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
        //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
        var childNode = node.firstChild, captureRemaining = null;
        if (childNode) {
            do {
                if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                    captureRemaining.push(childNode);
                else if (isStartComment(childNode)) {
                    var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                    if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
                        childNode = matchingEndComment;
                    else
                        captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                } else if (isEndComment(childNode)) {
                    captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                }
            } while (childNode = childNode.nextSibling);
        }
        return captureRemaining;
    }

    ko.virtualElements = {
        allowedBindings: {},

        childNodes: function(node) {
            return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
        },

        emptyNode: function(node) {
            if (!isStartComment(node))
                ko.utils.emptyDomNode(node);
            else {
                var virtualChildren = ko.virtualElements.childNodes(node);
                for (var i = 0, j = virtualChildren.length; i < j; i++)
                    ko.removeNode(virtualChildren[i]);
            }
        },

        setDomNodeChildren: function(node, childNodes) {
            if (!isStartComment(node))
                ko.utils.setDomNodeChildren(node, childNodes);
            else {
                ko.virtualElements.emptyNode(node);
                var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                for (var i = 0, j = childNodes.length; i < j; i++)
                    endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
            }
        },

        prepend: function(containerNode, nodeToPrepend) {
            if (!isStartComment(containerNode)) {
                if (containerNode.firstChild)
                    containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
                else
                    containerNode.appendChild(nodeToPrepend);
            } else {
                // Start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
            }
        },

        insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
            if (!insertAfterNode) {
                ko.virtualElements.prepend(containerNode, nodeToInsert);
            } else if (!isStartComment(containerNode)) {
                // Insert after insertion point
                if (insertAfterNode.nextSibling)
                    containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                else
                    containerNode.appendChild(nodeToInsert);
            } else {
                // Children of start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
            }
        },

        firstChild: function(node) {
            if (!isStartComment(node))
                return node.firstChild;
            if (!node.nextSibling || isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        nextSibling: function(node) {
            if (isStartComment(node))
                node = getMatchingEndComment(node);
            if (node.nextSibling && isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        hasBindingValue: isStartComment,

        virtualNodeBindingValue: function(node) {
            var regexMatch = (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
            return regexMatch ? regexMatch[1] : null;
        },

        normaliseVirtualElementDomStructure: function(elementVerified) {
            // Workaround for https://github.com/SteveSanderson/knockout/issues/155
            // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
            // that are direct descendants of <ul> into the preceding <li>)
            if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
                return;

            // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
            // must be intended to appear *after* that child, so move them there.
            var childNode = elementVerified.firstChild;
            if (childNode) {
                do {
                    if (childNode.nodeType === 1) {
                        var unbalancedTags = getUnbalancedChildTags(childNode);
                        if (unbalancedTags) {
                            // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                            var nodeToInsertBefore = childNode.nextSibling;
                            for (var i = 0; i < unbalancedTags.length; i++) {
                                if (nodeToInsertBefore)
                                    elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                else
                                    elementVerified.appendChild(unbalancedTags[i]);
                            }
                        }
                    }
                } while (childNode = childNode.nextSibling);
            }
        }
    };
})();
ko.exportSymbol('virtualElements', ko.virtualElements);
ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
//ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
//ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
(function() {
    var defaultBindingAttributeName = "data-bind";

    ko.bindingProvider = function() {
        this.bindingCache = {};
    };

    ko.utils.extend(ko.bindingProvider.prototype, {
        'nodeHasBindings': function(node) {
            switch (node.nodeType) {
                case 1: // Element
                    return node.getAttribute(defaultBindingAttributeName) != null
                        || ko.components['getComponentNameForNode'](node);
                case 8: // Comment node
                    return ko.virtualElements.hasBindingValue(node);
                default: return false;
            }
        },

        'getBindings': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext),
                parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node) : null;
            return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ false);
        },

        'getBindingAccessors': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext),
                parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node, { 'valueAccessors': true }) : null;
            return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ true);
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'getBindingsString': function(node, bindingContext) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                default: return null;
            }
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'parseBindingsString': function(bindingsString, bindingContext, node, options) {
            try {
                var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache, options);
                return bindingFunction(bindingContext, node);
            } catch (ex) {
                ex.message = "Unable to parse bindings.\nBindings value: " + bindingsString + "\nMessage: " + ex.message;
                throw ex;
            }
        }
    });

    ko.bindingProvider['instance'] = new ko.bindingProvider();

    function createBindingsStringEvaluatorViaCache(bindingsString, cache, options) {
        var cacheKey = bindingsString + (options && options['valueAccessors'] || '');
        return cache[cacheKey]
            || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, options));
    }

    function createBindingsStringEvaluator(bindingsString, options) {
        // Build the source for a function that evaluates "expression"
        // For each scope variable, add an extra level of "with" nesting
        // Example result: with(sc1) { with(sc0) { return (expression) } }
        var rewrittenBindings = ko.expressionRewriting.preProcessBindings(bindingsString, options),
            functionBody = "with($context){with($data||{}){return{" + rewrittenBindings + "}}}";
        return new Function("$context", "$element", functionBody);
    }
})();

ko.exportSymbol('bindingProvider', ko.bindingProvider);
(function () {
    ko.bindingHandlers = {};

    // The following element types will not be recursed into during binding.
    var bindingDoesNotRecurseIntoElementTypes = {
        // Don't want bindings that operate on text nodes to mutate <script> and <textarea> contents,
        // because it's unexpected and a potential XSS issue.
        // Also bindings should not operate on <template> elements since this breaks in Internet Explorer
        // and because such elements' contents are always intended to be bound in a different context
        // from where they appear in the document.
        'script': true,
        'textarea': true,
        'template': true
    };

    // Use an overridable method for retrieving binding handlers so that a plugins may support dynamically created handlers
    ko['getBindingHandler'] = function(bindingKey) {
        return ko.bindingHandlers[bindingKey];
    };

    // The ko.bindingContext constructor is only called directly to create the root context. For child
    // contexts, use bindingContext.createChildContext or bindingContext.extend.
    ko.bindingContext = function(dataItemOrAccessor, parentContext, dataItemAlias, extendCallback, options) {

        // The binding context object includes static properties for the current, parent, and root view models.
        // If a view model is actually stored in an observable, the corresponding binding context object, and
        // any child contexts, must be updated when the view model is changed.
        function updateContext() {
            // Most of the time, the context will directly get a view model object, but if a function is given,
            // we call the function to retrieve the view model. If the function accesses any observables or returns
            // an observable, the dependency is tracked, and those observables can later cause the binding
            // context to be updated.
            var dataItemOrObservable = isFunc ? dataItemOrAccessor() : dataItemOrAccessor,
                dataItem = ko.utils.unwrapObservable(dataItemOrObservable);

            if (parentContext) {
                // When a "parent" context is given, register a dependency on the parent context. Thus whenever the
                // parent context is updated, this context will also be updated.
                if (parentContext._subscribable)
                    parentContext._subscribable();

                // Copy $root and any custom properties from the parent context
                ko.utils.extend(self, parentContext);

                // Because the above copy overwrites our own properties, we need to reset them.
                self._subscribable = subscribable;
            } else {
                self['$parents'] = [];
                self['$root'] = dataItem;

                // Export 'ko' in the binding context so it will be available in bindings and templates
                // even if 'ko' isn't exported as a global, such as when using an AMD loader.
                // See https://github.com/SteveSanderson/knockout/issues/490
                self['ko'] = ko;
            }
            self['$rawData'] = dataItemOrObservable;
            self['$data'] = dataItem;
            if (dataItemAlias)
                self[dataItemAlias] = dataItem;

            // The extendCallback function is provided when creating a child context or extending a context.
            // It handles the specific actions needed to finish setting up the binding context. Actions in this
            // function could also add dependencies to this binding context.
            if (extendCallback)
                extendCallback(self, parentContext, dataItem);

            return self['$data'];
        }
        function disposeWhen() {
            return nodes && !ko.utils.anyDomNodeIsAttachedToDocument(nodes);
        }

        var self = this,
            isFunc = typeof(dataItemOrAccessor) == "function" && !ko.isObservable(dataItemOrAccessor),
            nodes,
            subscribable;

        if (options && options['exportDependencies']) {
            // The "exportDependencies" option means that the calling code will track any dependencies and re-create
            // the binding context when they change.
            updateContext();
        } else {
            subscribable = ko.dependentObservable(updateContext, null, { disposeWhen: disposeWhen, disposeWhenNodeIsRemoved: true });

            // At this point, the binding context has been initialized, and the "subscribable" computed observable is
            // subscribed to any observables that were accessed in the process. If there is nothing to track, the
            // computed will be inactive, and we can safely throw it away. If it's active, the computed is stored in
            // the context object.
            if (subscribable.isActive()) {
                self._subscribable = subscribable;

                // Always notify because even if the model ($data) hasn't changed, other context properties might have changed
                subscribable['equalityComparer'] = null;

                // We need to be able to dispose of this computed observable when it's no longer needed. This would be
                // easy if we had a single node to watch, but binding contexts can be used by many different nodes, and
                // we cannot assume that those nodes have any relation to each other. So instead we track any node that
                // the context is attached to, and dispose the computed when all of those nodes have been cleaned.

                // Add properties to *subscribable* instead of *self* because any properties added to *self* may be overwritten on updates
                nodes = [];
                subscribable._addNode = function(node) {
                    nodes.push(node);
                    ko.utils.domNodeDisposal.addDisposeCallback(node, function(node) {
                        ko.utils.arrayRemoveItem(nodes, node);
                        if (!nodes.length) {
                            subscribable.dispose();
                            self._subscribable = subscribable = undefined;
                        }
                    });
                };
            }
        }
    };

    // Extend the binding context hierarchy with a new view model object. If the parent context is watching
    // any observables, the new child context will automatically get a dependency on the parent context.
    // But this does not mean that the $data value of the child context will also get updated. If the child
    // view model also depends on the parent view model, you must provide a function that returns the correct
    // view model on each update.
    ko.bindingContext.prototype['createChildContext'] = function (dataItemOrAccessor, dataItemAlias, extendCallback, options) {
        return new ko.bindingContext(dataItemOrAccessor, this, dataItemAlias, function(self, parentContext) {
            // Extend the context hierarchy by setting the appropriate pointers
            self['$parentContext'] = parentContext;
            self['$parent'] = parentContext['$data'];
            self['$parents'] = (parentContext['$parents'] || []).slice(0);
            self['$parents'].unshift(self['$parent']);
            if (extendCallback)
                extendCallback(self);
        }, options);
    };

    // Extend the binding context with new custom properties. This doesn't change the context hierarchy.
    // Similarly to "child" contexts, provide a function here to make sure that the correct values are set
    // when an observable view model is updated.
    ko.bindingContext.prototype['extend'] = function(properties) {
        // If the parent context references an observable view model, "_subscribable" will always be the
        // latest view model object. If not, "_subscribable" isn't set, and we can use the static "$data" value.
        return new ko.bindingContext(this._subscribable || this['$data'], this, null, function(self, parentContext) {
            // This "child" context doesn't directly track a parent observable view model,
            // so we need to manually set the $rawData value to match the parent.
            self['$rawData'] = parentContext['$rawData'];
            ko.utils.extend(self, typeof(properties) == "function" ? properties() : properties);
        });
    };

    ko.bindingContext.prototype.createStaticChildContext = function (dataItemOrAccessor, dataItemAlias) {
        return this['createChildContext'](dataItemOrAccessor, dataItemAlias, null, { "exportDependencies": true });
    };

    // Returns the valueAccesor function for a binding value
    function makeValueAccessor(value) {
        return function() {
            return value;
        };
    }

    // Returns the value of a valueAccessor function
    function evaluateValueAccessor(valueAccessor) {
        return valueAccessor();
    }

    // Given a function that returns bindings, create and return a new object that contains
    // binding value-accessors functions. Each accessor function calls the original function
    // so that it always gets the latest value and all dependencies are captured. This is used
    // by ko.applyBindingsToNode and getBindingsAndMakeAccessors.
    function makeAccessorsFromFunction(callback) {
        return ko.utils.objectMap(ko.dependencyDetection.ignore(callback), function(value, key) {
            return function() {
                return callback()[key];
            };
        });
    }

    // Given a bindings function or object, create and return a new object that contains
    // binding value-accessors functions. This is used by ko.applyBindingsToNode.
    function makeBindingAccessors(bindings, context, node) {
        if (typeof bindings === 'function') {
            return makeAccessorsFromFunction(bindings.bind(null, context, node));
        } else {
            return ko.utils.objectMap(bindings, makeValueAccessor);
        }
    }

    // This function is used if the binding provider doesn't include a getBindingAccessors function.
    // It must be called with 'this' set to the provider instance.
    function getBindingsAndMakeAccessors(node, context) {
        return makeAccessorsFromFunction(this['getBindings'].bind(this, node, context));
    }

    function validateThatBindingIsAllowedForVirtualElements(bindingName) {
        var validator = ko.virtualElements.allowedBindings[bindingName];
        if (!validator)
            throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
    }

    function applyBindingsToDescendantsInternal (bindingContext, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
        var currentChild,
            nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement),
            provider = ko.bindingProvider['instance'],
            preprocessNode = provider['preprocessNode'];

        // Preprocessing allows a binding provider to mutate a node before bindings are applied to it. For example it's
        // possible to insert new siblings after it, and/or replace the node with a different one. This can be used to
        // implement custom binding syntaxes, such as {{ value }} for string interpolation, or custom element types that
        // trigger insertion of <template> contents at that point in the document.
        if (preprocessNode) {
            while (currentChild = nextInQueue) {
                nextInQueue = ko.virtualElements.nextSibling(currentChild);
                preprocessNode.call(provider, currentChild);
            }
            // Reset nextInQueue for the next loop
            nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
        }

        while (currentChild = nextInQueue) {
            // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
            nextInQueue = ko.virtualElements.nextSibling(currentChild);
            applyBindingsToNodeAndDescendantsInternal(bindingContext, currentChild, bindingContextsMayDifferFromDomParentElement);
        }
    }

    function applyBindingsToNodeAndDescendantsInternal (bindingContext, nodeVerified, bindingContextMayDifferFromDomParentElement) {
        var shouldBindDescendants = true;

        // Perf optimisation: Apply bindings only if...
        // (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
        //     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
        // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
        var isElement = (nodeVerified.nodeType === 1);
        if (isElement) // Workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

        var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement)             // Case (1)
                               || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
        if (shouldApplyBindings)
            shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, bindingContext, bindingContextMayDifferFromDomParentElement)['shouldBindDescendants'];

        if (shouldBindDescendants && !bindingDoesNotRecurseIntoElementTypes[ko.utils.tagNameLower(nodeVerified)]) {
            // We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
            //  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
            //    hence bindingContextsMayDifferFromDomParentElement is false
            //  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
            //    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
            //    hence bindingContextsMayDifferFromDomParentElement is true
            applyBindingsToDescendantsInternal(bindingContext, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
        }
    }

    var boundElementDomDataKey = ko.utils.domData.nextKey();


    function topologicalSortBindings(bindings) {
        // Depth-first sort
        var result = [],                // The list of key/handler pairs that we will return
            bindingsConsidered = {},    // A temporary record of which bindings are already in 'result'
            cyclicDependencyStack = []; // Keeps track of a depth-search so that, if there's a cycle, we know which bindings caused it
        ko.utils.objectForEach(bindings, function pushBinding(bindingKey) {
            if (!bindingsConsidered[bindingKey]) {
                var binding = ko['getBindingHandler'](bindingKey);
                if (binding) {
                    // First add dependencies (if any) of the current binding
                    if (binding['after']) {
                        cyclicDependencyStack.push(bindingKey);
                        ko.utils.arrayForEach(binding['after'], function(bindingDependencyKey) {
                            if (bindings[bindingDependencyKey]) {
                                if (ko.utils.arrayIndexOf(cyclicDependencyStack, bindingDependencyKey) !== -1) {
                                    throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + cyclicDependencyStack.join(", "));
                                } else {
                                    pushBinding(bindingDependencyKey);
                                }
                            }
                        });
                        cyclicDependencyStack.length--;
                    }
                    // Next add the current binding
                    result.push({ key: bindingKey, handler: binding });
                }
                bindingsConsidered[bindingKey] = true;
            }
        });

        return result;
    }

    function applyBindingsToNodeInternal(node, sourceBindings, bindingContext, bindingContextMayDifferFromDomParentElement) {
        // Prevent multiple applyBindings calls for the same node, except when a binding value is specified
        var alreadyBound = ko.utils.domData.get(node, boundElementDomDataKey);
        if (!sourceBindings) {
            if (alreadyBound) {
                throw Error("You cannot apply bindings multiple times to the same element.");
            }
            ko.utils.domData.set(node, boundElementDomDataKey, true);
        }

        // Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
        // we can easily recover it just by scanning up the node's ancestors in the DOM
        // (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
        if (!alreadyBound && bindingContextMayDifferFromDomParentElement)
            ko.storedBindingContextForNode(node, bindingContext);

        // Use bindings if given, otherwise fall back on asking the bindings provider to give us some bindings
        var bindings;
        if (sourceBindings && typeof sourceBindings !== 'function') {
            bindings = sourceBindings;
        } else {
            var provider = ko.bindingProvider['instance'],
                getBindings = provider['getBindingAccessors'] || getBindingsAndMakeAccessors;

            // Get the binding from the provider within a computed observable so that we can update the bindings whenever
            // the binding context is updated or if the binding provider accesses observables.
            var bindingsUpdater = ko.dependentObservable(
                function() {
                    bindings = sourceBindings ? sourceBindings(bindingContext, node) : getBindings.call(provider, node, bindingContext);
                    // Register a dependency on the binding context to support observable view models.
                    if (bindings && bindingContext._subscribable)
                        bindingContext._subscribable();
                    return bindings;
                },
                null, { disposeWhenNodeIsRemoved: node }
            );

            if (!bindings || !bindingsUpdater.isActive())
                bindingsUpdater = null;
        }

        var bindingHandlerThatControlsDescendantBindings;
        if (bindings) {
            // Return the value accessor for a given binding. When bindings are static (won't be updated because of a binding
            // context update), just return the value accessor from the binding. Otherwise, return a function that always gets
            // the latest binding value and registers a dependency on the binding updater.
            var getValueAccessor = bindingsUpdater
                ? function(bindingKey) {
                    return function() {
                        return evaluateValueAccessor(bindingsUpdater()[bindingKey]);
                    };
                } : function(bindingKey) {
                    return bindings[bindingKey];
                };

            // Use of allBindings as a function is maintained for backwards compatibility, but its use is deprecated
            function allBindings() {
                return ko.utils.objectMap(bindingsUpdater ? bindingsUpdater() : bindings, evaluateValueAccessor);
            }
            // The following is the 3.x allBindings API
            allBindings['get'] = function(key) {
                return bindings[key] && evaluateValueAccessor(getValueAccessor(key));
            };
            allBindings['has'] = function(key) {
                return key in bindings;
            };

            // First put the bindings into the right order
            var orderedBindings = topologicalSortBindings(bindings);

            // Go through the sorted bindings, calling init and update for each
            ko.utils.arrayForEach(orderedBindings, function(bindingKeyAndHandler) {
                // Note that topologicalSortBindings has already filtered out any nonexistent binding handlers,
                // so bindingKeyAndHandler.handler will always be nonnull.
                var handlerInitFn = bindingKeyAndHandler.handler["init"],
                    handlerUpdateFn = bindingKeyAndHandler.handler["update"],
                    bindingKey = bindingKeyAndHandler.key;

                if (node.nodeType === 8) {
                    validateThatBindingIsAllowedForVirtualElements(bindingKey);
                }

                try {
                    // Run init, ignoring any dependencies
                    if (typeof handlerInitFn == "function") {
                        ko.dependencyDetection.ignore(function() {
                            var initResult = handlerInitFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);

                            // If this binding handler claims to control descendant bindings, make a note of this
                            if (initResult && initResult['controlsDescendantBindings']) {
                                if (bindingHandlerThatControlsDescendantBindings !== undefined)
                                    throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                bindingHandlerThatControlsDescendantBindings = bindingKey;
                            }
                        });
                    }

                    // Run update in its own computed wrapper
                    if (typeof handlerUpdateFn == "function") {
                        ko.dependentObservable(
                            function() {
                                handlerUpdateFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);
                            },
                            null,
                            { disposeWhenNodeIsRemoved: node }
                        );
                    }
                } catch (ex) {
                    ex.message = "Unable to process binding \"" + bindingKey + ": " + bindings[bindingKey] + "\"\nMessage: " + ex.message;
                    throw ex;
                }
            });
        }

        return {
            'shouldBindDescendants': bindingHandlerThatControlsDescendantBindings === undefined
        };
    }

    var storedBindingContextDomDataKey = ko.utils.domData.nextKey();
    ko.storedBindingContextForNode = function (node, bindingContext) {
        if (arguments.length == 2) {
            ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
            if (bindingContext._subscribable)
                bindingContext._subscribable._addNode(node);
        } else {
            return ko.utils.domData.get(node, storedBindingContextDomDataKey);
        }
    };

    function getBindingContext(viewModelOrBindingContext) {
        return viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
            ? viewModelOrBindingContext
            : new ko.bindingContext(viewModelOrBindingContext);
    }

    ko.applyBindingAccessorsToNode = function (node, bindings, viewModelOrBindingContext) {
        if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(node);
        return applyBindingsToNodeInternal(node, bindings, getBindingContext(viewModelOrBindingContext), true);
    };

    ko.applyBindingsToNode = function (node, bindings, viewModelOrBindingContext) {
        var context = getBindingContext(viewModelOrBindingContext);
        return ko.applyBindingAccessorsToNode(node, makeBindingAccessors(bindings, context, node), context);
    };

    ko.applyBindingsToDescendants = function(viewModelOrBindingContext, rootNode) {
        if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
            applyBindingsToDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
    };

    ko.applyBindings = function (viewModelOrBindingContext, rootNode) {
        // If jQuery is loaded after Knockout, we won't initially have access to it. So save it here.
        if (!jQueryInstance && window['jQuery']) {
            jQueryInstance = window['jQuery'];
        }

        if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
            throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
        rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional

        applyBindingsToNodeAndDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
    };

    // Retrieving binding context from arbitrary nodes
    ko.contextFor = function(node) {
        // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
        switch (node.nodeType) {
            case 1:
            case 8:
                var context = ko.storedBindingContextForNode(node);
                if (context) return context;
                if (node.parentNode) return ko.contextFor(node.parentNode);
                break;
        }
        return undefined;
    };
    ko.dataFor = function(node) {
        var context = ko.contextFor(node);
        return context ? context['$data'] : undefined;
    };

    ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
    ko.exportSymbol('applyBindings', ko.applyBindings);
    ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
    ko.exportSymbol('applyBindingAccessorsToNode', ko.applyBindingAccessorsToNode);
    ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
    ko.exportSymbol('contextFor', ko.contextFor);
    ko.exportSymbol('dataFor', ko.dataFor);
})();
(function(undefined) {
    var loadingSubscribablesCache = {}, // Tracks component loads that are currently in flight
        loadedDefinitionsCache = {};    // Tracks component loads that have already completed

    ko.components = {
        get: function(componentName, callback) {
            var cachedDefinition = getObjectOwnProperty(loadedDefinitionsCache, componentName);
            if (cachedDefinition) {
                // It's already loaded and cached. Reuse the same definition object.
                // Note that for API consistency, even cache hits complete asynchronously by default.
                // You can bypass this by putting synchronous:true on your component config.
                if (cachedDefinition.isSynchronousComponent) {
                    ko.dependencyDetection.ignore(function() { // See comment in loaderRegistryBehaviors.js for reasoning
                        callback(cachedDefinition.definition);
                    });
                } else {
                    ko.tasks.schedule(function() { callback(cachedDefinition.definition); });
                }
            } else {
                // Join the loading process that is already underway, or start a new one.
                loadComponentAndNotify(componentName, callback);
            }
        },

        clearCachedDefinition: function(componentName) {
            delete loadedDefinitionsCache[componentName];
        },

        _getFirstResultFromLoaders: getFirstResultFromLoaders
    };

    function getObjectOwnProperty(obj, propName) {
        return obj.hasOwnProperty(propName) ? obj[propName] : undefined;
    }

    function loadComponentAndNotify(componentName, callback) {
        var subscribable = getObjectOwnProperty(loadingSubscribablesCache, componentName),
            completedAsync;
        if (!subscribable) {
            // It's not started loading yet. Start loading, and when it's done, move it to loadedDefinitionsCache.
            subscribable = loadingSubscribablesCache[componentName] = new ko.subscribable();
            subscribable.subscribe(callback);

            beginLoadingComponent(componentName, function(definition, config) {
                var isSynchronousComponent = !!(config && config['synchronous']);
                loadedDefinitionsCache[componentName] = { definition: definition, isSynchronousComponent: isSynchronousComponent };
                delete loadingSubscribablesCache[componentName];

                // For API consistency, all loads complete asynchronously. However we want to avoid
                // adding an extra task schedule if it's unnecessary (i.e., the completion is already
                // async).
                //
                // You can bypass the 'always asynchronous' feature by putting the synchronous:true
                // flag on your component configuration when you register it.
                if (completedAsync || isSynchronousComponent) {
                    // Note that notifySubscribers ignores any dependencies read within the callback.
                    // See comment in loaderRegistryBehaviors.js for reasoning
                    subscribable['notifySubscribers'](definition);
                } else {
                    ko.tasks.schedule(function() {
                        subscribable['notifySubscribers'](definition);
                    });
                }
            });
            completedAsync = true;
        } else {
            subscribable.subscribe(callback);
        }
    }

    function beginLoadingComponent(componentName, callback) {
        getFirstResultFromLoaders('getConfig', [componentName], function(config) {
            if (config) {
                // We have a config, so now load its definition
                getFirstResultFromLoaders('loadComponent', [componentName, config], function(definition) {
                    callback(definition, config);
                });
            } else {
                // The component has no config - it's unknown to all the loaders.
                // Note that this is not an error (e.g., a module loading error) - that would abort the
                // process and this callback would not run. For this callback to run, all loaders must
                // have confirmed they don't know about this component.
                callback(null, null);
            }
        });
    }

    function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
        // On the first call in the stack, start with the full set of loaders
        if (!candidateLoaders) {
            candidateLoaders = ko.components['loaders'].slice(0); // Use a copy, because we'll be mutating this array
        }

        // Try the next candidate
        var currentCandidateLoader = candidateLoaders.shift();
        if (currentCandidateLoader) {
            var methodInstance = currentCandidateLoader[methodName];
            if (methodInstance) {
                var wasAborted = false,
                    synchronousReturnValue = methodInstance.apply(currentCandidateLoader, argsExceptCallback.concat(function(result) {
                        if (wasAborted) {
                            callback(null);
                        } else if (result !== null) {
                            // This candidate returned a value. Use it.
                            callback(result);
                        } else {
                            // Try the next candidate
                            getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
                        }
                    }));

                // Currently, loaders may not return anything synchronously. This leaves open the possibility
                // that we'll extend the API to support synchronous return values in the future. It won't be
                // a breaking change, because currently no loader is allowed to return anything except undefined.
                if (synchronousReturnValue !== undefined) {
                    wasAborted = true;

                    // Method to suppress exceptions will remain undocumented. This is only to keep
                    // KO's specs running tidily, since we can observe the loading got aborted without
                    // having exceptions cluttering up the console too.
                    if (!currentCandidateLoader['suppressLoaderExceptions']) {
                        throw new Error('Component loaders must supply values by invoking the callback, not by returning values synchronously.');
                    }
                }
            } else {
                // This candidate doesn't have the relevant handler. Synchronously move on to the next one.
                getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
            }
        } else {
            // No candidates returned a value
            callback(null);
        }
    }

    // Reference the loaders via string name so it's possible for developers
    // to replace the whole array by assigning to ko.components.loaders
    ko.components['loaders'] = [];

    ko.exportSymbol('components', ko.components);
    ko.exportSymbol('components.get', ko.components.get);
    ko.exportSymbol('components.clearCachedDefinition', ko.components.clearCachedDefinition);
})();
(function(undefined) {

    // The default loader is responsible for two things:
    // 1. Maintaining the default in-memory registry of component configuration objects
    //    (i.e., the thing you're writing to when you call ko.components.register(someName, ...))
    // 2. Answering requests for components by fetching configuration objects
    //    from that default in-memory registry and resolving them into standard
    //    component definition objects (of the form { createViewModel: ..., template: ... })
    // Custom loaders may override either of these facilities, i.e.,
    // 1. To supply configuration objects from some other source (e.g., conventions)
    // 2. Or, to resolve configuration objects by loading viewmodels/templates via arbitrary logic.

    var defaultConfigRegistry = {};

    ko.components.register = function(componentName, config) {
        if (!config) {
            throw new Error('Invalid configuration for ' + componentName);
        }

        if (ko.components.isRegistered(componentName)) {
            throw new Error('Component ' + componentName + ' is already registered');
        }

        defaultConfigRegistry[componentName] = config;
    };

    ko.components.isRegistered = function(componentName) {
        return defaultConfigRegistry.hasOwnProperty(componentName);
    };

    ko.components.unregister = function(componentName) {
        delete defaultConfigRegistry[componentName];
        ko.components.clearCachedDefinition(componentName);
    };

    ko.components.defaultLoader = {
        'getConfig': function(componentName, callback) {
            var result = defaultConfigRegistry.hasOwnProperty(componentName)
                ? defaultConfigRegistry[componentName]
                : null;
            callback(result);
        },

        'loadComponent': function(componentName, config, callback) {
            var errorCallback = makeErrorCallback(componentName);
            possiblyGetConfigFromAmd(errorCallback, config, function(loadedConfig) {
                resolveConfig(componentName, errorCallback, loadedConfig, callback);
            });
        },

        'loadTemplate': function(componentName, templateConfig, callback) {
            resolveTemplate(makeErrorCallback(componentName), templateConfig, callback);
        },

        'loadViewModel': function(componentName, viewModelConfig, callback) {
            resolveViewModel(makeErrorCallback(componentName), viewModelConfig, callback);
        }
    };

    var createViewModelKey = 'createViewModel';

    // Takes a config object of the form { template: ..., viewModel: ... }, and asynchronously convert it
    // into the standard component definition format:
    //    { template: <ArrayOfDomNodes>, createViewModel: function(params, componentInfo) { ... } }.
    // Since both template and viewModel may need to be resolved asynchronously, both tasks are performed
    // in parallel, and the results joined when both are ready. We don't depend on any promises infrastructure,
    // so this is implemented manually below.
    function resolveConfig(componentName, errorCallback, config, callback) {
        var result = {},
            makeCallBackWhenZero = 2,
            tryIssueCallback = function() {
                if (--makeCallBackWhenZero === 0) {
                    callback(result);
                }
            },
            templateConfig = config['template'],
            viewModelConfig = config['viewModel'];

        if (templateConfig) {
            possiblyGetConfigFromAmd(errorCallback, templateConfig, function(loadedConfig) {
                ko.components._getFirstResultFromLoaders('loadTemplate', [componentName, loadedConfig], function(resolvedTemplate) {
                    result['template'] = resolvedTemplate;
                    tryIssueCallback();
                });
            });
        } else {
            tryIssueCallback();
        }

        if (viewModelConfig) {
            possiblyGetConfigFromAmd(errorCallback, viewModelConfig, function(loadedConfig) {
                ko.components._getFirstResultFromLoaders('loadViewModel', [componentName, loadedConfig], function(resolvedViewModel) {
                    result[createViewModelKey] = resolvedViewModel;
                    tryIssueCallback();
                });
            });
        } else {
            tryIssueCallback();
        }
    }

    function resolveTemplate(errorCallback, templateConfig, callback) {
        if (typeof templateConfig === 'string') {
            // Markup - parse it
            callback(ko.utils.parseHtmlFragment(templateConfig));
        } else if (templateConfig instanceof Array) {
            // Assume already an array of DOM nodes - pass through unchanged
            callback(templateConfig);
        } else if (isDocumentFragment(templateConfig)) {
            // Document fragment - use its child nodes
            callback(ko.utils.makeArray(templateConfig.childNodes));
        } else if (templateConfig['element']) {
            var element = templateConfig['element'];
            if (isDomElement(element)) {
                // Element instance - copy its child nodes
                callback(cloneNodesFromTemplateSourceElement(element));
            } else if (typeof element === 'string') {
                // Element ID - find it, then copy its child nodes
                var elemInstance = document.getElementById(element);
                if (elemInstance) {
                    callback(cloneNodesFromTemplateSourceElement(elemInstance));
                } else {
                    errorCallback('Cannot find element with ID ' + element);
                }
            } else {
                errorCallback('Unknown element type: ' + element);
            }
        } else {
            errorCallback('Unknown template value: ' + templateConfig);
        }
    }

    function resolveViewModel(errorCallback, viewModelConfig, callback) {
        if (typeof viewModelConfig === 'function') {
            // Constructor - convert to standard factory function format
            // By design, this does *not* supply componentInfo to the constructor, as the intent is that
            // componentInfo contains non-viewmodel data (e.g., the component's element) that should only
            // be used in factory functions, not viewmodel constructors.
            callback(function (params /*, componentInfo */) {
                return new viewModelConfig(params);
            });
        } else if (typeof viewModelConfig[createViewModelKey] === 'function') {
            // Already a factory function - use it as-is
            callback(viewModelConfig[createViewModelKey]);
        } else if ('instance' in viewModelConfig) {
            // Fixed object instance - promote to createViewModel format for API consistency
            var fixedInstance = viewModelConfig['instance'];
            callback(function (params, componentInfo) {
                return fixedInstance;
            });
        } else if ('viewModel' in viewModelConfig) {
            // Resolved AMD module whose value is of the form { viewModel: ... }
            resolveViewModel(errorCallback, viewModelConfig['viewModel'], callback);
        } else {
            errorCallback('Unknown viewModel value: ' + viewModelConfig);
        }
    }

    function cloneNodesFromTemplateSourceElement(elemInstance) {
        switch (ko.utils.tagNameLower(elemInstance)) {
            case 'script':
                return ko.utils.parseHtmlFragment(elemInstance.text);
            case 'textarea':
                return ko.utils.parseHtmlFragment(elemInstance.value);
            case 'template':
                // For browsers with proper <template> element support (i.e., where the .content property
                // gives a document fragment), use that document fragment.
                if (isDocumentFragment(elemInstance.content)) {
                    return ko.utils.cloneNodes(elemInstance.content.childNodes);
                }
        }

        // Regular elements such as <div>, and <template> elements on old browsers that don't really
        // understand <template> and just treat it as a regular container
        return ko.utils.cloneNodes(elemInstance.childNodes);
    }

    function isDomElement(obj) {
        if (window['HTMLElement']) {
            return obj instanceof HTMLElement;
        } else {
            return obj && obj.tagName && obj.nodeType === 1;
        }
    }

    function isDocumentFragment(obj) {
        if (window['DocumentFragment']) {
            return obj instanceof DocumentFragment;
        } else {
            return obj && obj.nodeType === 11;
        }
    }

    function possiblyGetConfigFromAmd(errorCallback, config, callback) {
        if (typeof config['require'] === 'string') {
            // The config is the value of an AMD module
            if (amdRequire || window['require']) {
                (amdRequire || window['require'])([config['require']], callback);
            } else {
                errorCallback('Uses require, but no AMD loader is present');
            }
        } else {
            callback(config);
        }
    }

    function makeErrorCallback(componentName) {
        return function (message) {
            throw new Error('Component \'' + componentName + '\': ' + message);
        };
    }

    ko.exportSymbol('components.register', ko.components.register);
    ko.exportSymbol('components.isRegistered', ko.components.isRegistered);
    ko.exportSymbol('components.unregister', ko.components.unregister);

    // Expose the default loader so that developers can directly ask it for configuration
    // or to resolve configuration
    ko.exportSymbol('components.defaultLoader', ko.components.defaultLoader);

    // By default, the default loader is the only registered component loader
    ko.components['loaders'].push(ko.components.defaultLoader);

    // Privately expose the underlying config registry for use in old-IE shim
    ko.components._allRegisteredComponents = defaultConfigRegistry;
})();
(function (undefined) {
    // Overridable API for determining which component name applies to a given node. By overriding this,
    // you can for example map specific tagNames to components that are not preregistered.
    ko.components['getComponentNameForNode'] = function(node) {
        var tagNameLower = ko.utils.tagNameLower(node);
        if (ko.components.isRegistered(tagNameLower)) {
            // Try to determine that this node can be considered a *custom* element; see https://github.com/knockout/knockout/issues/1603
            if (tagNameLower.indexOf('-') != -1 || ('' + node) == "[object HTMLUnknownElement]" || (ko.utils.ieVersion <= 8 && node.tagName === tagNameLower)) {
                return tagNameLower;
            }
        }
    };

    ko.components.addBindingsForCustomElement = function(allBindings, node, bindingContext, valueAccessors) {
        // Determine if it's really a custom element matching a component
        if (node.nodeType === 1) {
            var componentName = ko.components['getComponentNameForNode'](node);
            if (componentName) {
                // It does represent a component, so add a component binding for it
                allBindings = allBindings || {};

                if (allBindings['component']) {
                    // Avoid silently overwriting some other 'component' binding that may already be on the element
                    throw new Error('Cannot use the "component" binding on a custom element matching a component');
                }

                var componentBindingValue = { 'name': componentName, 'params': getComponentParamsFromCustomElement(node, bindingContext) };

                allBindings['component'] = valueAccessors
                    ? function() { return componentBindingValue; }
                    : componentBindingValue;
            }
        }

        return allBindings;
    };

    var nativeBindingProviderInstance = new ko.bindingProvider();

    function getComponentParamsFromCustomElement(elem, bindingContext) {
        var paramsAttribute = elem.getAttribute('params');

        if (paramsAttribute) {
            var params = nativeBindingProviderInstance['parseBindingsString'](paramsAttribute, bindingContext, elem, { 'valueAccessors': true, 'bindingParams': true }),
                rawParamComputedValues = ko.utils.objectMap(params, function(paramValue, paramName) {
                    return ko.computed(paramValue, null, { disposeWhenNodeIsRemoved: elem });
                }),
                result = ko.utils.objectMap(rawParamComputedValues, function(paramValueComputed, paramName) {
                    var paramValue = paramValueComputed.peek();
                    // Does the evaluation of the parameter value unwrap any observables?
                    if (!paramValueComputed.isActive()) {
                        // No it doesn't, so there's no need for any computed wrapper. Just pass through the supplied value directly.
                        // Example: "someVal: firstName, age: 123" (whether or not firstName is an observable/computed)
                        return paramValue;
                    } else {
                        // Yes it does. Supply a computed property that unwraps both the outer (binding expression)
                        // level of observability, and any inner (resulting model value) level of observability.
                        // This means the component doesn't have to worry about multiple unwrapping. If the value is a
                        // writable observable, the computed will also be writable and pass the value on to the observable.
                        return ko.computed({
                            'read': function() {
                                return ko.utils.unwrapObservable(paramValueComputed());
                            },
                            'write': ko.isWriteableObservable(paramValue) && function(value) {
                                paramValueComputed()(value);
                            },
                            disposeWhenNodeIsRemoved: elem
                        });
                    }
                });

            // Give access to the raw computeds, as long as that wouldn't overwrite any custom param also called '$raw'
            // This is in case the developer wants to react to outer (binding) observability separately from inner
            // (model value) observability, or in case the model value observable has subobservables.
            if (!result.hasOwnProperty('$raw')) {
                result['$raw'] = rawParamComputedValues;
            }

            return result;
        } else {
            // For consistency, absence of a "params" attribute is treated the same as the presence of
            // any empty one. Otherwise component viewmodels need special code to check whether or not
            // 'params' or 'params.$raw' is null/undefined before reading subproperties, which is annoying.
            return { '$raw': {} };
        }
    }

    // --------------------------------------------------------------------------------
    // Compatibility code for older (pre-HTML5) IE browsers

    if (ko.utils.ieVersion < 9) {
        // Whenever you preregister a component, enable it as a custom element in the current document
        ko.components['register'] = (function(originalFunction) {
            return function(componentName) {
                document.createElement(componentName); // Allows IE<9 to parse markup containing the custom element
                return originalFunction.apply(this, arguments);
            }
        })(ko.components['register']);

        // Whenever you create a document fragment, enable all preregistered component names as custom elements
        // This is needed to make innerShiv/jQuery HTML parsing correctly handle the custom elements
        document.createDocumentFragment = (function(originalFunction) {
            return function() {
                var newDocFrag = originalFunction(),
                    allComponents = ko.components._allRegisteredComponents;
                for (var componentName in allComponents) {
                    if (allComponents.hasOwnProperty(componentName)) {
                        newDocFrag.createElement(componentName);
                    }
                }
                return newDocFrag;
            };
        })(document.createDocumentFragment);
    }
})();(function(undefined) {

    var componentLoadingOperationUniqueId = 0;

    ko.bindingHandlers['component'] = {
        'init': function(element, valueAccessor, ignored1, ignored2, bindingContext) {
            var currentViewModel,
                currentLoadingOperationId,
                disposeAssociatedComponentViewModel = function () {
                    var currentViewModelDispose = currentViewModel && currentViewModel['dispose'];
                    if (typeof currentViewModelDispose === 'function') {
                        currentViewModelDispose.call(currentViewModel);
                    }
                    currentViewModel = null;
                    // Any in-flight loading operation is no longer relevant, so make sure we ignore its completion
                    currentLoadingOperationId = null;
                },
                originalChildNodes = ko.utils.makeArray(ko.virtualElements.childNodes(element));

            ko.utils.domNodeDisposal.addDisposeCallback(element, disposeAssociatedComponentViewModel);

            ko.computed(function () {
                var value = ko.utils.unwrapObservable(valueAccessor()),
                    componentName, componentParams;

                if (typeof value === 'string') {
                    componentName = value;
                } else {
                    componentName = ko.utils.unwrapObservable(value['name']);
                    componentParams = ko.utils.unwrapObservable(value['params']);
                }

                if (!componentName) {
                    throw new Error('No component name specified');
                }

                var loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;
                ko.components.get(componentName, function(componentDefinition) {
                    // If this is not the current load operation for this element, ignore it.
                    if (currentLoadingOperationId !== loadingOperationId) {
                        return;
                    }

                    // Clean up previous state
                    disposeAssociatedComponentViewModel();

                    // Instantiate and bind new component. Implicitly this cleans any old DOM nodes.
                    if (!componentDefinition) {
                        throw new Error('Unknown component \'' + componentName + '\'');
                    }
                    cloneTemplateIntoElement(componentName, componentDefinition, element);
                    var componentViewModel = createViewModel(componentDefinition, element, originalChildNodes, componentParams),
                        childBindingContext = bindingContext['createChildContext'](componentViewModel, /* dataItemAlias */ undefined, function(ctx) {
                            ctx['$component'] = componentViewModel;
                            ctx['$componentTemplateNodes'] = originalChildNodes;
                        });
                    currentViewModel = componentViewModel;
                    ko.applyBindingsToDescendants(childBindingContext, element);
                });
            }, null, { disposeWhenNodeIsRemoved: element });

            return { 'controlsDescendantBindings': true };
        }
    };

    ko.virtualElements.allowedBindings['component'] = true;

    function cloneTemplateIntoElement(componentName, componentDefinition, element) {
        var template = componentDefinition['template'];
        if (!template) {
            throw new Error('Component \'' + componentName + '\' has no template');
        }

        var clonedNodesArray = ko.utils.cloneNodes(template);
        ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
    }

    function createViewModel(componentDefinition, element, originalChildNodes, componentParams) {
        var componentViewModelFactory = componentDefinition['createViewModel'];
        return componentViewModelFactory
            ? componentViewModelFactory.call(componentDefinition, componentParams, { 'element': element, 'templateNodes': originalChildNodes })
            : componentParams; // Template-only component
    }

})();
var attrHtmlToJavascriptMap = { 'class': 'className', 'for': 'htmlFor' };
ko.bindingHandlers['attr'] = {
    'update': function(element, valueAccessor, allBindings) {
        var value = ko.utils.unwrapObservable(valueAccessor()) || {};
        ko.utils.objectForEach(value, function(attrName, attrValue) {
            attrValue = ko.utils.unwrapObservable(attrValue);

            // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
            // when someProp is a "no value"-like value (strictly null, false, or undefined)
            // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
            var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
            if (toRemove)
                element.removeAttribute(attrName);

            // In IE <= 7 and IE8 Quirks Mode, you have to use the Javascript property name instead of the
            // HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
            // but instead of figuring out the mode, we'll just set the attribute through the Javascript
            // property for IE <= 8.
            if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
                attrName = attrHtmlToJavascriptMap[attrName];
                if (toRemove)
                    element.removeAttribute(attrName);
                else
                    element[attrName] = attrValue;
            } else if (!toRemove) {
                element.setAttribute(attrName, attrValue.toString());
            }

            // Treat "name" specially - although you can think of it as an attribute, it also needs
            // special handling on older versions of IE (https://github.com/SteveSanderson/knockout/pull/333)
            // Deliberately being case-sensitive here because XHTML would regard "Name" as a different thing
            // entirely, and there's no strong reason to allow for such casing in HTML.
            if (attrName === "name") {
                ko.utils.setElementName(element, toRemove ? "" : attrValue.toString());
            }
        });
    }
};
(function() {

ko.bindingHandlers['checked'] = {
    'after': ['value', 'attr'],
    'init': function (element, valueAccessor, allBindings) {
        var checkedValue = ko.pureComputed(function() {
            // Treat "value" like "checkedValue" when it is included with "checked" binding
            if (allBindings['has']('checkedValue')) {
                return ko.utils.unwrapObservable(allBindings.get('checkedValue'));
            } else if (allBindings['has']('value')) {
                return ko.utils.unwrapObservable(allBindings.get('value'));
            }

            return element.value;
        });

        function updateModel() {
            // This updates the model value from the view value.
            // It runs in response to DOM events (click) and changes in checkedValue.
            var isChecked = element.checked,
                elemValue = useCheckedValue ? checkedValue() : isChecked;

            // When we're first setting up this computed, don't change any model state.
            if (ko.computedContext.isInitial()) {
                return;
            }

            // We can ignore unchecked radio buttons, because some other radio
            // button will be getting checked, and that one can take care of updating state.
            if (isRadio && !isChecked) {
                return;
            }

            var modelValue = ko.dependencyDetection.ignore(valueAccessor);
            if (valueIsArray) {
                var writableValue = rawValueIsNonArrayObservable ? modelValue.peek() : modelValue;
                if (oldElemValue !== elemValue) {
                    // When we're responding to the checkedValue changing, and the element is
                    // currently checked, replace the old elem value with the new elem value
                    // in the model array.
                    if (isChecked) {
                        ko.utils.addOrRemoveItem(writableValue, elemValue, true);
                        ko.utils.addOrRemoveItem(writableValue, oldElemValue, false);
                    }

                    oldElemValue = elemValue;
                } else {
                    // When we're responding to the user having checked/unchecked a checkbox,
                    // add/remove the element value to the model array.
                    ko.utils.addOrRemoveItem(writableValue, elemValue, isChecked);
                }
                if (rawValueIsNonArrayObservable && ko.isWriteableObservable(modelValue)) {
                    modelValue(writableValue);
                }
            } else {
                ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'checked', elemValue, true);
            }
        }

        function updateView() {
            // This updates the view value from the model value.
            // It runs in response to changes in the bound (checked) value.
            var modelValue = ko.utils.unwrapObservable(valueAccessor());

            if (valueIsArray) {
                // When a checkbox is bound to an array, being checked represents its value being present in that array
                element.checked = ko.utils.arrayIndexOf(modelValue, checkedValue()) >= 0;
            } else if (isCheckbox) {
                // When a checkbox is bound to any other value (not an array), being checked represents the value being trueish
                element.checked = modelValue;
            } else {
                // For radio buttons, being checked means that the radio button's value corresponds to the model value
                element.checked = (checkedValue() === modelValue);
            }
        }

        var isCheckbox = element.type == "checkbox",
            isRadio = element.type == "radio";

        // Only bind to check boxes and radio buttons
        if (!isCheckbox && !isRadio) {
            return;
        }

        var rawValue = valueAccessor(),
            valueIsArray = isCheckbox && (ko.utils.unwrapObservable(rawValue) instanceof Array),
            rawValueIsNonArrayObservable = !(valueIsArray && rawValue.push && rawValue.splice),
            oldElemValue = valueIsArray ? checkedValue() : undefined,
            useCheckedValue = isRadio || valueIsArray;

        // IE 6 won't allow radio buttons to be selected unless they have a name
        if (isRadio && !element.name)
            ko.bindingHandlers['uniqueName']['init'](element, function() { return true });

        // Set up two computeds to update the binding:

        // The first responds to changes in the checkedValue value and to element clicks
        ko.computed(updateModel, null, { disposeWhenNodeIsRemoved: element });
        ko.utils.registerEventHandler(element, "click", updateModel);

        // The second responds to changes in the model value (the one associated with the checked binding)
        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });

        rawValue = undefined;
    }
};
ko.expressionRewriting.twoWayBindings['checked'] = true;

ko.bindingHandlers['checkedValue'] = {
    'update': function (element, valueAccessor) {
        element.value = ko.utils.unwrapObservable(valueAccessor());
    }
};

})();var classesWrittenByBindingKey = '__ko__cssValue';
ko.bindingHandlers['css'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value !== null && typeof value == "object") {
            ko.utils.objectForEach(value, function(className, shouldHaveClass) {
                shouldHaveClass = ko.utils.unwrapObservable(shouldHaveClass);
                ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
            });
        } else {
            value = ko.utils.stringTrim(String(value || '')); // Make sure we don't try to store or set a non-string value
            ko.utils.toggleDomNodeCssClass(element, element[classesWrittenByBindingKey], false);
            element[classesWrittenByBindingKey] = value;
            ko.utils.toggleDomNodeCssClass(element, value, true);
        }
    }
};
ko.bindingHandlers['enable'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value && element.disabled)
            element.removeAttribute("disabled");
        else if ((!value) && (!element.disabled))
            element.disabled = true;
    }
};

ko.bindingHandlers['disable'] = {
    'update': function (element, valueAccessor) {
        ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
    }
};
// For certain common events (currently just 'click'), allow a simplified data-binding syntax
// e.g. click:handler instead of the usual full-length event:{click:handler}
function makeEventHandlerShortcut(eventName) {
    ko.bindingHandlers[eventName] = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var newValueAccessor = function () {
                var result = {};
                result[eventName] = valueAccessor();
                return result;
            };
            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
        }
    };
}

ko.bindingHandlers['event'] = {
    'init' : function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var eventsToHandle = valueAccessor() || {};
        ko.utils.objectForEach(eventsToHandle, function(eventName) {
            if (typeof eventName == "string") {
                ko.utils.registerEventHandler(element, eventName, function (event) {
                    var handlerReturnValue;
                    var handlerFunction = valueAccessor()[eventName];
                    if (!handlerFunction)
                        return;

                    try {
                        // Take all the event args, and prefix with the viewmodel
                        var argsForHandler = ko.utils.makeArray(arguments);
                        viewModel = bindingContext['$data'];
                        argsForHandler.unshift(viewModel);
                        handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                    } finally {
                        if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                            if (event.preventDefault)
                                event.preventDefault();
                            else
                                event.returnValue = false;
                        }
                    }

                    var bubble = allBindings.get(eventName + 'Bubble') !== false;
                    if (!bubble) {
                        event.cancelBubble = true;
                        if (event.stopPropagation)
                            event.stopPropagation();
                    }
                });
            }
        });
    }
};
// "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
// "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
ko.bindingHandlers['foreach'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() {
            var modelValue = valueAccessor(),
                unwrappedValue = ko.utils.peekObservable(modelValue);    // Unwrap without setting a dependency here

            // If unwrappedValue is the array, pass in the wrapped value on its own
            // The value will be unwrapped and tracked within the template binding
            // (See https://github.com/SteveSanderson/knockout/issues/523)
            if ((!unwrappedValue) || typeof unwrappedValue.length == "number")
                return { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };

            // If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
            ko.utils.unwrapObservable(modelValue);
            return {
                'foreach': unwrappedValue['data'],
                'as': unwrappedValue['as'],
                'includeDestroyed': unwrappedValue['includeDestroyed'],
                'afterAdd': unwrappedValue['afterAdd'],
                'beforeRemove': unwrappedValue['beforeRemove'],
                'afterRender': unwrappedValue['afterRender'],
                'beforeMove': unwrappedValue['beforeMove'],
                'afterMove': unwrappedValue['afterMove'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
        };
    },
    'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
    }
};
ko.expressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['foreach'] = true;
var hasfocusUpdatingProperty = '__ko_hasfocusUpdating';
var hasfocusLastValue = '__ko_hasfocusLastValue';
ko.bindingHandlers['hasfocus'] = {
    'init': function(element, valueAccessor, allBindings) {
        var handleElementFocusChange = function(isFocused) {
            // Where possible, ignore which event was raised and determine focus state using activeElement,
            // as this avoids phantom focus/blur events raised when changing tabs in modern browsers.
            // However, not all KO-targeted browsers (Firefox 2) support activeElement. For those browsers,
            // prevent a loss of focus when changing tabs/windows by setting a flag that prevents hasfocus
            // from calling 'blur()' on the element when it loses focus.
            // Discussion at https://github.com/SteveSanderson/knockout/pull/352
            element[hasfocusUpdatingProperty] = true;
            var ownerDoc = element.ownerDocument;
            if ("activeElement" in ownerDoc) {
                var active;
                try {
                    active = ownerDoc.activeElement;
                } catch(e) {
                    // IE9 throws if you access activeElement during page load (see issue #703)
                    active = ownerDoc.body;
                }
                isFocused = (active === element);
            }
            var modelValue = valueAccessor();
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'hasfocus', isFocused, true);

            //cache the latest value, so we can avoid unnecessarily calling focus/blur in the update function
            element[hasfocusLastValue] = isFocused;
            element[hasfocusUpdatingProperty] = false;
        };
        var handleElementFocusIn = handleElementFocusChange.bind(null, true);
        var handleElementFocusOut = handleElementFocusChange.bind(null, false);

        ko.utils.registerEventHandler(element, "focus", handleElementFocusIn);
        ko.utils.registerEventHandler(element, "focusin", handleElementFocusIn); // For IE
        ko.utils.registerEventHandler(element, "blur",  handleElementFocusOut);
        ko.utils.registerEventHandler(element, "focusout",  handleElementFocusOut); // For IE
    },
    'update': function(element, valueAccessor) {
        var value = !!ko.utils.unwrapObservable(valueAccessor());

        if (!element[hasfocusUpdatingProperty] && element[hasfocusLastValue] !== value) {
            value ? element.focus() : element.blur();

            // In IE, the blur method doesn't always cause the element to lose focus (for example, if the window is not in focus).
            // Setting focus to the body element does seem to be reliable in IE, but should only be used if we know that the current
            // element was focused already.
            if (!value && element[hasfocusLastValue]) {
                element.ownerDocument.body.focus();
            }

            // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
            ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, value ? "focusin" : "focusout"]);
        }
    }
};
ko.expressionRewriting.twoWayBindings['hasfocus'] = true;

ko.bindingHandlers['hasFocus'] = ko.bindingHandlers['hasfocus']; // Make "hasFocus" an alias
ko.expressionRewriting.twoWayBindings['hasFocus'] = true;
ko.bindingHandlers['html'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        // setHtml will unwrap the value if needed
        ko.utils.setHtml(element, valueAccessor());
    }
};
// Makes a binding like with or if
function makeWithIfBinding(bindingKey, isWith, isNot, makeContextCallback) {
    ko.bindingHandlers[bindingKey] = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var didDisplayOnLastUpdate,
                savedNodes;
            ko.computed(function() {
                var rawValue = valueAccessor(),
                    dataValue = ko.utils.unwrapObservable(rawValue),
                    shouldDisplay = !isNot !== !dataValue, // equivalent to isNot ? !dataValue : !!dataValue
                    isFirstRender = !savedNodes,
                    needsRefresh = isFirstRender || isWith || (shouldDisplay !== didDisplayOnLastUpdate);

                if (needsRefresh) {
                    // Save a copy of the inner nodes on the initial update, but only if we have dependencies.
                    if (isFirstRender && ko.computedContext.getDependenciesCount()) {
                        savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true /* shouldCleanNodes */);
                    }

                    if (shouldDisplay) {
                        if (!isFirstRender) {
                            ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(savedNodes));
                        }
                        ko.applyBindingsToDescendants(makeContextCallback ? makeContextCallback(bindingContext, rawValue) : bindingContext, element);
                    } else {
                        ko.virtualElements.emptyNode(element);
                    }

                    didDisplayOnLastUpdate = shouldDisplay;
                }
            }, null, { disposeWhenNodeIsRemoved: element });
            return { 'controlsDescendantBindings': true };
        }
    };
    ko.expressionRewriting.bindingRewriteValidators[bindingKey] = false; // Can't rewrite control flow bindings
    ko.virtualElements.allowedBindings[bindingKey] = true;
}

// Construct the actual binding handlers
makeWithIfBinding('if');
makeWithIfBinding('ifnot', false /* isWith */, true /* isNot */);
makeWithIfBinding('with', true /* isWith */, false /* isNot */,
    function(bindingContext, dataValue) {
        return bindingContext.createStaticChildContext(dataValue);
    }
);
var captionPlaceholder = {};
ko.bindingHandlers['options'] = {
    'init': function(element) {
        if (ko.utils.tagNameLower(element) !== "select")
            throw new Error("options binding applies only to SELECT elements");

        // Remove all existing <option>s.
        while (element.length > 0) {
            element.remove(0);
        }

        // Ensures that the binding processor doesn't try to bind the options
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor, allBindings) {
        function selectedOptions() {
            return ko.utils.arrayFilter(element.options, function (node) { return node.selected; });
        }

        var selectWasPreviouslyEmpty = element.length == 0,
            multiple = element.multiple,
            previousScrollTop = (!selectWasPreviouslyEmpty && multiple) ? element.scrollTop : null,
            unwrappedArray = ko.utils.unwrapObservable(valueAccessor()),
            valueAllowUnset = allBindings.get('valueAllowUnset') && allBindings['has']('value'),
            includeDestroyed = allBindings.get('optionsIncludeDestroyed'),
            arrayToDomNodeChildrenOptions = {},
            captionValue,
            filteredArray,
            previousSelectedValues = [];

        if (!valueAllowUnset) {
            if (multiple) {
                previousSelectedValues = ko.utils.arrayMap(selectedOptions(), ko.selectExtensions.readValue);
            } else if (element.selectedIndex >= 0) {
                previousSelectedValues.push(ko.selectExtensions.readValue(element.options[element.selectedIndex]));
            }
        }

        if (unwrappedArray) {
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return includeDestroyed || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            // If caption is included, add it to the array
            if (allBindings['has']('optionsCaption')) {
                captionValue = ko.utils.unwrapObservable(allBindings.get('optionsCaption'));
                // If caption value is null or undefined, don't show a caption
                if (captionValue !== null && captionValue !== undefined) {
                    filteredArray.unshift(captionPlaceholder);
                }
            }
        } else {
            // If a falsy value is provided (e.g. null), we'll simply empty the select element
        }

        function applyToObject(object, predicate, defaultValue) {
            var predicateType = typeof predicate;
            if (predicateType == "function")    // Given a function; run it against the data value
                return predicate(object);
            else if (predicateType == "string") // Given a string; treat it as a property name on the data value
                return object[predicate];
            else                                // Given no optionsText arg; use the data value itself
                return defaultValue;
        }

        // The following functions can run at two different times:
        // The first is when the whole array is being updated directly from this binding handler.
        // The second is when an observable value for a specific array entry is updated.
        // oldOptions will be empty in the first case, but will be filled with the previously generated option in the second.
        var itemUpdate = false;
        function optionForArrayItem(arrayEntry, index, oldOptions) {
            if (oldOptions.length) {
                previousSelectedValues = !valueAllowUnset && oldOptions[0].selected ? [ ko.selectExtensions.readValue(oldOptions[0]) ] : [];
                itemUpdate = true;
            }
            var option = element.ownerDocument.createElement("option");
            if (arrayEntry === captionPlaceholder) {
                ko.utils.setTextContent(option, allBindings.get('optionsCaption'));
                ko.selectExtensions.writeValue(option, undefined);
            } else {
                // Apply a value to the option element
                var optionValue = applyToObject(arrayEntry, allBindings.get('optionsValue'), arrayEntry);
                ko.selectExtensions.writeValue(option, ko.utils.unwrapObservable(optionValue));

                // Apply some text to the option element
                var optionText = applyToObject(arrayEntry, allBindings.get('optionsText'), optionValue);
                ko.utils.setTextContent(option, optionText);
            }
            return [option];
        }

        // By using a beforeRemove callback, we delay the removal until after new items are added. This fixes a selection
        // problem in IE<=8 and Firefox. See https://github.com/knockout/knockout/issues/1208
        arrayToDomNodeChildrenOptions['beforeRemove'] =
            function (option) {
                element.removeChild(option);
            };

        function setSelectionCallback(arrayEntry, newOptions) {
            if (itemUpdate && valueAllowUnset) {
                // The model value is authoritative, so make sure its value is the one selected
                // There is no need to use dependencyDetection.ignore since setDomNodeChildrenFromArrayMapping does so already.
                ko.selectExtensions.writeValue(element, ko.utils.unwrapObservable(allBindings.get('value')), true /* allowUnset */);
            } else if (previousSelectedValues.length) {
                // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
                // That's why we first added them without selection. Now it's time to set the selection.
                var isSelected = ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[0])) >= 0;
                ko.utils.setOptionNodeSelectionState(newOptions[0], isSelected);

                // If this option was changed from being selected during a single-item update, notify the change
                if (itemUpdate && !isSelected) {
                    ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
                }
            }
        }

        var callback = setSelectionCallback;
        if (allBindings['has']('optionsAfterRender') && typeof allBindings.get('optionsAfterRender') == "function") {
            callback = function(arrayEntry, newOptions) {
                setSelectionCallback(arrayEntry, newOptions);
                ko.dependencyDetection.ignore(allBindings.get('optionsAfterRender'), null, [newOptions[0], arrayEntry !== captionPlaceholder ? arrayEntry : undefined]);
            };
        }

        ko.utils.setDomNodeChildrenFromArrayMapping(element, filteredArray, optionForArrayItem, arrayToDomNodeChildrenOptions, callback);

        ko.dependencyDetection.ignore(function () {
            if (valueAllowUnset) {
                // The model value is authoritative, so make sure its value is the one selected
                ko.selectExtensions.writeValue(element, ko.utils.unwrapObservable(allBindings.get('value')), true /* allowUnset */);
            } else {
                // Determine if the selection has changed as a result of updating the options list
                var selectionChanged;
                if (multiple) {
                    // For a multiple-select box, compare the new selection count to the previous one
                    // But if nothing was selected before, the selection can't have changed
                    selectionChanged = previousSelectedValues.length && selectedOptions().length < previousSelectedValues.length;
                } else {
                    // For a single-select box, compare the current value to the previous value
                    // But if nothing was selected before or nothing is selected now, just look for a change in selection
                    selectionChanged = (previousSelectedValues.length && element.selectedIndex >= 0)
                        ? (ko.selectExtensions.readValue(element.options[element.selectedIndex]) !== previousSelectedValues[0])
                        : (previousSelectedValues.length || element.selectedIndex >= 0);
                }

                // Ensure consistency between model value and selected option.
                // If the dropdown was changed so that selection is no longer the same,
                // notify the value or selectedOptions binding.
                if (selectionChanged) {
                    ko.utils.triggerEvent(element, "change");
                }
            }
        });

        // Workaround for IE bug
        ko.utils.ensureSelectElementIsRenderedCorrectly(element);

        if (previousScrollTop && Math.abs(previousScrollTop - element.scrollTop) > 20)
            element.scrollTop = previousScrollTop;
    }
};
ko.bindingHandlers['options'].optionValueDomDataKey = ko.utils.domData.nextKey();
ko.bindingHandlers['selectedOptions'] = {
    'after': ['options', 'foreach'],
    'init': function (element, valueAccessor, allBindings) {
        ko.utils.registerEventHandler(element, "change", function () {
            var value = valueAccessor(), valueToWrite = [];
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                if (node.selected)
                    valueToWrite.push(ko.selectExtensions.readValue(node));
            });
            ko.expressionRewriting.writeValueToProperty(value, allBindings, 'selectedOptions', valueToWrite);
        });
    },
    'update': function (element, valueAccessor) {
        if (ko.utils.tagNameLower(element) != "select")
            throw new Error("values binding applies only to SELECT elements");

        var newValue = ko.utils.unwrapObservable(valueAccessor()),
            previousScrollTop = element.scrollTop;

        if (newValue && typeof newValue.length == "number") {
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                var isSelected = ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0;
                if (node.selected != isSelected) {      // This check prevents flashing of the select element in IE
                    ko.utils.setOptionNodeSelectionState(node, isSelected);
                }
            });
        }

        element.scrollTop = previousScrollTop;
    }
};
ko.expressionRewriting.twoWayBindings['selectedOptions'] = true;
ko.bindingHandlers['style'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        ko.utils.objectForEach(value, function(styleName, styleValue) {
            styleValue = ko.utils.unwrapObservable(styleValue);

            if (styleValue === null || styleValue === undefined || styleValue === false) {
                // Empty string removes the value, whereas null/undefined have no effect
                styleValue = "";
            }

            element.style[styleName] = styleValue;
        });
    }
};
ko.bindingHandlers['submit'] = {
    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (typeof valueAccessor() != "function")
            throw new Error("The value for a submit binding must be a function");
        ko.utils.registerEventHandler(element, "submit", function (event) {
            var handlerReturnValue;
            var value = valueAccessor();
            try { handlerReturnValue = value.call(bindingContext['$data'], element); }
            finally {
                if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                }
            }
        });
    }
};
ko.bindingHandlers['text'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected text node (as developers are unlikely to expect that, and it has security implications).
        // It should also make things faster, as we no longer have to consider whether the text node might be bindable.
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        ko.utils.setTextContent(element, valueAccessor());
    }
};
ko.virtualElements.allowedBindings['text'] = true;
(function () {

if (window && window.navigator) {
    var parseVersion = function (matches) {
        if (matches) {
            return parseFloat(matches[1]);
        }
    };

    // Detect various browser versions because some old versions don't fully support the 'input' event
    var operaVersion = window.opera && window.opera.version && parseInt(window.opera.version()),
        userAgent = window.navigator.userAgent,
        safariVersion = parseVersion(userAgent.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),
        firefoxVersion = parseVersion(userAgent.match(/Firefox\/([^ ]*)/));
}

// IE 8 and 9 have bugs that prevent the normal events from firing when the value changes.
// But it does fire the 'selectionchange' event on many of those, presumably because the
// cursor is moving and that counts as the selection changing. The 'selectionchange' event is
// fired at the document level only and doesn't directly indicate which element changed. We
// set up just one event handler for the document and use 'activeElement' to determine which
// element was changed.
if (ko.utils.ieVersion < 10) {
    var selectionChangeRegisteredName = ko.utils.domData.nextKey(),
        selectionChangeHandlerName = ko.utils.domData.nextKey();
    var selectionChangeHandler = function(event) {
        var target = this.activeElement,
            handler = target && ko.utils.domData.get(target, selectionChangeHandlerName);
        if (handler) {
            handler(event);
        }
    };
    var registerForSelectionChangeEvent = function (element, handler) {
        var ownerDoc = element.ownerDocument;
        if (!ko.utils.domData.get(ownerDoc, selectionChangeRegisteredName)) {
            ko.utils.domData.set(ownerDoc, selectionChangeRegisteredName, true);
            ko.utils.registerEventHandler(ownerDoc, 'selectionchange', selectionChangeHandler);
        }
        ko.utils.domData.set(element, selectionChangeHandlerName, handler);
    };
}

ko.bindingHandlers['textInput'] = {
    'init': function (element, valueAccessor, allBindings) {

        var previousElementValue = element.value,
            timeoutHandle,
            elementValueBeforeEvent;

        var updateModel = function (event) {
            clearTimeout(timeoutHandle);
            elementValueBeforeEvent = timeoutHandle = undefined;

            var elementValue = element.value;
            if (previousElementValue !== elementValue) {
                // Provide a way for tests to know exactly which event was processed
                if (DEBUG && event) element['_ko_textInputProcessedEvent'] = event.type;
                previousElementValue = elementValue;
                ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'textInput', elementValue);
            }
        };

        var deferUpdateModel = function (event) {
            if (!timeoutHandle) {
                // The elementValueBeforeEvent variable is set *only* during the brief gap between an
                // event firing and the updateModel function running. This allows us to ignore model
                // updates that are from the previous state of the element, usually due to techniques
                // such as rateLimit. Such updates, if not ignored, can cause keystrokes to be lost.
                elementValueBeforeEvent = element.value;
                var handler = DEBUG ? updateModel.bind(element, {type: event.type}) : updateModel;
                timeoutHandle = ko.utils.setTimeout(handler, 4);
            }
        };

        // IE9 will mess up the DOM if you handle events synchronously which results in DOM changes (such as other bindings);
        // so we'll make sure all updates are asynchronous
        var ieUpdateModel = ko.utils.ieVersion == 9 ? deferUpdateModel : updateModel;

        var updateView = function () {
            var modelValue = ko.utils.unwrapObservable(valueAccessor());

            if (modelValue === null || modelValue === undefined) {
                modelValue = '';
            }

            if (elementValueBeforeEvent !== undefined && modelValue === elementValueBeforeEvent) {
                ko.utils.setTimeout(updateView, 4);
                return;
            }

            // Update the element only if the element and model are different. On some browsers, updating the value
            // will move the cursor to the end of the input, which would be bad while the user is typing.
            if (element.value !== modelValue) {
                previousElementValue = modelValue;  // Make sure we ignore events (propertychange) that result from updating the value
                element.value = modelValue;
            }
        };

        var onEvent = function (event, handler) {
            ko.utils.registerEventHandler(element, event, handler);
        };

        if (DEBUG && ko.bindingHandlers['textInput']['_forceUpdateOn']) {
            // Provide a way for tests to specify exactly which events are bound
            ko.utils.arrayForEach(ko.bindingHandlers['textInput']['_forceUpdateOn'], function(eventName) {
                if (eventName.slice(0,5) == 'after') {
                    onEvent(eventName.slice(5), deferUpdateModel);
                } else {
                    onEvent(eventName, updateModel);
                }
            });
        } else {
            if (ko.utils.ieVersion < 10) {
                // Internet Explorer <= 8 doesn't support the 'input' event, but does include 'propertychange' that fires whenever
                // any property of an element changes. Unlike 'input', it also fires if a property is changed from JavaScript code,
                // but that's an acceptable compromise for this binding. IE 9 does support 'input', but since it doesn't fire it
                // when using autocomplete, we'll use 'propertychange' for it also.
                onEvent('propertychange', function(event) {
                    if (event.propertyName === 'value') {
                        ieUpdateModel(event);
                    }
                });

                if (ko.utils.ieVersion == 8) {
                    // IE 8 has a bug where it fails to fire 'propertychange' on the first update following a value change from
                    // JavaScript code. It also doesn't fire if you clear the entire value. To fix this, we bind to the following
                    // events too.
                    onEvent('keyup', updateModel);      // A single keystoke
                    onEvent('keydown', updateModel);    // The first character when a key is held down
                }
                if (ko.utils.ieVersion >= 8) {
                    // Internet Explorer 9 doesn't fire the 'input' event when deleting text, including using
                    // the backspace, delete, or ctrl-x keys, clicking the 'x' to clear the input, dragging text
                    // out of the field, and cutting or deleting text using the context menu. 'selectionchange'
                    // can detect all of those except dragging text out of the field, for which we use 'dragend'.
                    // These are also needed in IE8 because of the bug described above.
                    registerForSelectionChangeEvent(element, ieUpdateModel);  // 'selectionchange' covers cut, paste, drop, delete, etc.
                    onEvent('dragend', deferUpdateModel);
                }
            } else {
                // All other supported browsers support the 'input' event, which fires whenever the content of the element is changed
                // through the user interface.
                onEvent('input', updateModel);

                if (safariVersion < 5 && ko.utils.tagNameLower(element) === "textarea") {
                    // Safari <5 doesn't fire the 'input' event for <textarea> elements (it does fire 'textInput'
                    // but only when typing). So we'll just catch as much as we can with keydown, cut, and paste.
                    onEvent('keydown', deferUpdateModel);
                    onEvent('paste', deferUpdateModel);
                    onEvent('cut', deferUpdateModel);
                } else if (operaVersion < 11) {
                    // Opera 10 doesn't always fire the 'input' event for cut, paste, undo & drop operations.
                    // We can try to catch some of those using 'keydown'.
                    onEvent('keydown', deferUpdateModel);
                } else if (firefoxVersion < 4.0) {
                    // Firefox <= 3.6 doesn't fire the 'input' event when text is filled in through autocomplete
                    onEvent('DOMAutoComplete', updateModel);

                    // Firefox <=3.5 doesn't fire the 'input' event when text is dropped into the input.
                    onEvent('dragdrop', updateModel);       // <3.5
                    onEvent('drop', updateModel);           // 3.5
                }
            }
        }

        // Bind to the change event so that we can catch programmatic updates of the value that fire this event.
        onEvent('change', updateModel);

        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
    }
};
ko.expressionRewriting.twoWayBindings['textInput'] = true;

// textinput is an alias for textInput
ko.bindingHandlers['textinput'] = {
    // preprocess is the only way to set up a full alias
    'preprocess': function (value, name, addBinding) {
        addBinding('textInput', value);
    }
};

})();ko.bindingHandlers['uniqueName'] = {
    'init': function (element, valueAccessor) {
        if (valueAccessor()) {
            var name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);
            ko.utils.setElementName(element, name);
        }
    }
};
ko.bindingHandlers['uniqueName'].currentIndex = 0;
ko.bindingHandlers['value'] = {
    'after': ['options', 'foreach'],
    'init': function (element, valueAccessor, allBindings) {
        // If the value binding is placed on a radio/checkbox, then just pass through to checkedValue and quit
        if (element.tagName.toLowerCase() == "input" && (element.type == "checkbox" || element.type == "radio")) {
            ko.applyBindingAccessorsToNode(element, { 'checkedValue': valueAccessor });
            return;
        }

        // Always catch "change" event; possibly other events too if asked
        var eventsToCatch = ["change"];
        var requestedEventsToCatch = allBindings.get("valueUpdate");
        var propertyChangedFired = false;
        var elementValueBeforeEvent = null;

        if (requestedEventsToCatch) {
            if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
                requestedEventsToCatch = [requestedEventsToCatch];
            ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
            eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
        }

        var valueUpdateHandler = function() {
            elementValueBeforeEvent = null;
            propertyChangedFired = false;
            var modelValue = valueAccessor();
            var elementValue = ko.selectExtensions.readValue(element);
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'value', elementValue);
        };

        // Workaround for https://github.com/SteveSanderson/knockout/issues/122
        // IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
        var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text"
                                       && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
        if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
            ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true; });
            ko.utils.registerEventHandler(element, "focus", function () { propertyChangedFired = false; });
            ko.utils.registerEventHandler(element, "blur", function() {
                if (propertyChangedFired) {
                    valueUpdateHandler();
                }
            });
        }

        ko.utils.arrayForEach(eventsToCatch, function(eventName) {
            // The syntax "after<eventname>" means "run the handler asynchronously after the event"
            // This is useful, for example, to catch "keydown" events after the browser has updated the control
            // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
            var handler = valueUpdateHandler;
            if (ko.utils.stringStartsWith(eventName, "after")) {
                handler = function() {
                    // The elementValueBeforeEvent variable is non-null *only* during the brief gap between
                    // a keyX event firing and the valueUpdateHandler running, which is scheduled to happen
                    // at the earliest asynchronous opportunity. We store this temporary information so that
                    // if, between keyX and valueUpdateHandler, the underlying model value changes separately,
                    // we can overwrite that model value change with the value the user just typed. Otherwise,
                    // techniques like rateLimit can trigger model changes at critical moments that will
                    // override the user's inputs, causing keystrokes to be lost.
                    elementValueBeforeEvent = ko.selectExtensions.readValue(element);
                    ko.utils.setTimeout(valueUpdateHandler, 0);
                };
                eventName = eventName.substring("after".length);
            }
            ko.utils.registerEventHandler(element, eventName, handler);
        });

        var updateFromModel = function () {
            var newValue = ko.utils.unwrapObservable(valueAccessor());
            var elementValue = ko.selectExtensions.readValue(element);

            if (elementValueBeforeEvent !== null && newValue === elementValueBeforeEvent) {
                ko.utils.setTimeout(updateFromModel, 0);
                return;
            }

            var valueHasChanged = (newValue !== elementValue);

            if (valueHasChanged) {
                if (ko.utils.tagNameLower(element) === "select") {
                    var allowUnset = allBindings.get('valueAllowUnset');
                    var applyValueAction = function () {
                        ko.selectExtensions.writeValue(element, newValue, allowUnset);
                    };
                    applyValueAction();

                    if (!allowUnset && newValue !== ko.selectExtensions.readValue(element)) {
                        // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
                        // because you're not allowed to have a model value that disagrees with a visible UI selection.
                        ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
                    } else {
                        // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
                        // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
                        // to apply the value as well.
                        ko.utils.setTimeout(applyValueAction, 0);
                    }
                } else {
                    ko.selectExtensions.writeValue(element, newValue);
                }
            }
        };

        ko.computed(updateFromModel, null, { disposeWhenNodeIsRemoved: element });
    },
    'update': function() {} // Keep for backwards compatibility with code that may have wrapped value binding
};
ko.expressionRewriting.twoWayBindings['value'] = true;
ko.bindingHandlers['visible'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible)
            element.style.display = "";
        else if ((!value) && isCurrentlyVisible)
            element.style.display = "none";
    }
};
// 'click' is just a shorthand for the usual full-length event:{click:handler}
makeEventHandlerShortcut('click');
// If you want to make a custom template engine,
//
// [1] Inherit from this class (like ko.nativeTemplateEngine does)
// [2] Override 'renderTemplateSource', supplying a function with this signature:
//
//        function (templateSource, bindingContext, options) {
//            // - templateSource.text() is the text of the template you should render
//            // - bindingContext.$data is the data you should pass into the template
//            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
//            //     and bindingContext.$root available in the template too
//            // - options gives you access to any other properties set on "data-bind: { template: options }"
//            // - templateDocument is the document object of the template
//            //
//            // Return value: an array of DOM nodes
//        }
//
// [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
//
//        function (script) {
//            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
//            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
//        }
//
//     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
//     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
//     and then you don't need to override 'createJavaScriptEvaluatorBlock'.

ko.templateEngine = function () { };

ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options, templateDocument) {
    throw new Error("Override renderTemplateSource");
};

ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
    throw new Error("Override createJavaScriptEvaluatorBlock");
};

ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {
    // Named template
    if (typeof template == "string") {
        templateDocument = templateDocument || document;
        var elem = templateDocument.getElementById(template);
        if (!elem)
            throw new Error("Cannot find template with ID " + template);
        return new ko.templateSources.domElement(elem);
    } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
        // Anonymous template
        return new ko.templateSources.anonymousTemplate(template);
    } else
        throw new Error("Unknown template type: " + template);
};

ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    return this['renderTemplateSource'](templateSource, bindingContext, options, templateDocument);
};

ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
    // Skip rewriting if requested
    if (this['allowTemplateRewriting'] === false)
        return true;
    return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
};

ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    var rewritten = rewriterCallback(templateSource['text']());
    templateSource['text'](rewritten);
    templateSource['data']("isRewritten", true);
};

ko.exportSymbol('templateEngine', ko.templateEngine);

ko.templateRewriting = (function () {
    var memoizeDataBindingAttributeSyntaxRegex = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'|[^>]*))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi;
    var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

    function validateDataBindValuesForRewriting(keyValueArray) {
        var allValidators = ko.expressionRewriting.bindingRewriteValidators;
        for (var i = 0; i < keyValueArray.length; i++) {
            var key = keyValueArray[i]['key'];
            if (allValidators.hasOwnProperty(key)) {
                var validator = allValidators[key];

                if (typeof validator === "function") {
                    var possibleErrorMessage = validator(keyValueArray[i]['value']);
                    if (possibleErrorMessage)
                        throw new Error(possibleErrorMessage);
                } else if (!validator) {
                    throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                }
            }
        }
    }

    function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, nodeName, templateEngine) {
        var dataBindKeyValueArray = ko.expressionRewriting.parseObjectLiteral(dataBindAttributeValue);
        validateDataBindValuesForRewriting(dataBindKeyValueArray);
        var rewrittenDataBindAttributeValue = ko.expressionRewriting.preProcessBindings(dataBindKeyValueArray, {'valueAccessors':true});

        // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
        // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
        // extra indirection.
        var applyBindingsToNextSiblingScript =
            "ko.__tr_ambtns(function($context,$element){return(function(){return{ " + rewrittenDataBindAttributeValue + " } })()},'" + nodeName.toLowerCase() + "')";
        return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
    }

    return {
        ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
            if (!templateEngine['isTemplateRewritten'](template, templateDocument))
                templateEngine['rewriteTemplate'](template, function (htmlString) {
                    return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                }, templateDocument);
        },

        memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
            return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[4], /* tagToRetain: */ arguments[1], /* nodeName: */ arguments[2], templateEngine);
            }).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", /* nodeName: */ "#comment", templateEngine);
            });
        },

        applyMemoizedBindingsToNextSibling: function (bindings, nodeName) {
            return ko.memoization.memoize(function (domNode, bindingContext) {
                var nodeToBind = domNode.nextSibling;
                if (nodeToBind && nodeToBind.nodeName.toLowerCase() === nodeName) {
                    ko.applyBindingAccessorsToNode(nodeToBind, bindings, bindingContext);
                }
            });
        }
    }
})();


// Exported only because it has to be referenced by string lookup from within rewritten template
ko.exportSymbol('__tr_ambtns', ko.templateRewriting.applyMemoizedBindingsToNextSibling);
(function() {
    // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
    // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
    //
    // Two are provided by default:
    //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
    //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
    //                                           without reading/writing the actual element text content, since it will be overwritten
    //                                           with the rendered template output.
    // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
    // Template sources need to have the following functions:
    //   text() 			- returns the template text from your storage location
    //   text(value)		- writes the supplied template text to your storage location
    //   data(key)			- reads values stored using data(key, value) - see below
    //   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
    //
    // Optionally, template sources can also have the following functions:
    //   nodes()            - returns a DOM element containing the nodes of this template, where available
    //   nodes(value)       - writes the given DOM element to your storage location
    // If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
    // for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
    //
    // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
    // using and overriding "makeTemplateSource" to return an instance of your custom template source.

    ko.templateSources = {};

    // ---- ko.templateSources.domElement -----

    // template types
    var templateScript = 1,
        templateTextArea = 2,
        templateTemplate = 3,
        templateElement = 4;

    ko.templateSources.domElement = function(element) {
        this.domElement = element;

        if (element) {
            var tagNameLower = ko.utils.tagNameLower(element);
            this.templateType =
                tagNameLower === "script" ? templateScript :
                tagNameLower === "textarea" ? templateTextArea :
                    // For browsers with proper <template> element support, where the .content property gives a document fragment
                tagNameLower == "template" && element.content && element.content.nodeType === 11 ? templateTemplate :
                templateElement;
        }
    };

    ko.templateSources.domElement.prototype['text'] = function(/* valueToWrite */) {
        var elemContentsProperty = this.templateType === templateScript ? "text"
                                 : this.templateType === templateTextArea ? "value"
                                 : "innerHTML";

        if (arguments.length == 0) {
            return this.domElement[elemContentsProperty];
        } else {
            var valueToWrite = arguments[0];
            if (elemContentsProperty === "innerHTML")
                ko.utils.setHtml(this.domElement, valueToWrite);
            else
                this.domElement[elemContentsProperty] = valueToWrite;
        }
    };

    var dataDomDataPrefix = ko.utils.domData.nextKey() + "_";
    ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */) {
        if (arguments.length === 1) {
            return ko.utils.domData.get(this.domElement, dataDomDataPrefix + key);
        } else {
            ko.utils.domData.set(this.domElement, dataDomDataPrefix + key, arguments[1]);
        }
    };

    var templatesDomDataKey = ko.utils.domData.nextKey();
    function getTemplateDomData(element) {
        return ko.utils.domData.get(element, templatesDomDataKey) || {};
    }
    function setTemplateDomData(element, data) {
        ko.utils.domData.set(element, templatesDomDataKey, data);
    }

    ko.templateSources.domElement.prototype['nodes'] = function(/* valueToWrite */) {
        var element = this.domElement;
        if (arguments.length == 0) {
            var templateData = getTemplateDomData(element),
                containerData = templateData.containerData;
            return containerData || (
                this.templateType === templateTemplate ? element.content :
                this.templateType === templateElement ? element :
                undefined);
        } else {
            var valueToWrite = arguments[0];
            setTemplateDomData(element, {containerData: valueToWrite});
        }
    };

    // ---- ko.templateSources.anonymousTemplate -----
    // Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
    // For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
    // Writing to "text" is still supported, but then the template data will not be available as DOM nodes.

    ko.templateSources.anonymousTemplate = function(element) {
        this.domElement = element;
    };
    ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
    ko.templateSources.anonymousTemplate.prototype.constructor = ko.templateSources.anonymousTemplate;
    ko.templateSources.anonymousTemplate.prototype['text'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = getTemplateDomData(this.domElement);
            if (templateData.textData === undefined && templateData.containerData)
                templateData.textData = templateData.containerData.innerHTML;
            return templateData.textData;
        } else {
            var valueToWrite = arguments[0];
            setTemplateDomData(this.domElement, {textData: valueToWrite});
        }
    };

    ko.exportSymbol('templateSources', ko.templateSources);
    ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
    ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
})();
(function () {
    var _templateEngine;
    ko.setTemplateEngine = function (templateEngine) {
        if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
            throw new Error("templateEngine must inherit from ko.templateEngine");
        _templateEngine = templateEngine;
    };

    function invokeForEachNodeInContinuousRange(firstNode, lastNode, action) {
        var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
        while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
            nextInQueue = ko.virtualElements.nextSibling(node);
            action(node, nextInQueue);
        }
    }

    function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
        // To be used on any nodes that have been rendered by a template and have been inserted into some parent element
        // Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
        // the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
        // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
        // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)

        if (continuousNodeArray.length) {
            var firstNode = continuousNodeArray[0],
                lastNode = continuousNodeArray[continuousNodeArray.length - 1],
                parentNode = firstNode.parentNode,
                provider = ko.bindingProvider['instance'],
                preprocessNode = provider['preprocessNode'];

            if (preprocessNode) {
                invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node, nextNodeInRange) {
                    var nodePreviousSibling = node.previousSibling;
                    var newNodes = preprocessNode.call(provider, node);
                    if (newNodes) {
                        if (node === firstNode)
                            firstNode = newNodes[0] || nextNodeInRange;
                        if (node === lastNode)
                            lastNode = newNodes[newNodes.length - 1] || nodePreviousSibling;
                    }
                });

                // Because preprocessNode can change the nodes, including the first and last nodes, update continuousNodeArray to match.
                // We need the full set, including inner nodes, because the unmemoize step might remove the first node (and so the real
                // first node needs to be in the array).
                continuousNodeArray.length = 0;
                if (!firstNode) { // preprocessNode might have removed all the nodes, in which case there's nothing left to do
                    return;
                }
                if (firstNode === lastNode) {
                    continuousNodeArray.push(firstNode);
                } else {
                    continuousNodeArray.push(firstNode, lastNode);
                    ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
                }
            }

            // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
            // whereas a regular applyBindings won't introduce new memoized nodes
            invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
                if (node.nodeType === 1 || node.nodeType === 8)
                    ko.applyBindings(bindingContext, node);
            });
            invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
                if (node.nodeType === 1 || node.nodeType === 8)
                    ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
            });

            // Make sure any changes done by applyBindings or unmemoize are reflected in the array
            ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
        }
    }

    function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
        return nodeOrNodeArray.nodeType ? nodeOrNodeArray
                                        : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
                                        : null;
    }

    function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
        options = options || {};
        var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
        var templateDocument = (firstTargetNode || template || {}).ownerDocument;
        var templateEngineToUse = (options['templateEngine'] || _templateEngine);
        ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
        var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

        // Loosely check result is an array of DOM nodes
        if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
            throw new Error("Template engine must return an array of DOM nodes");

        var haveAddedNodesToParent = false;
        switch (renderMode) {
            case "replaceChildren":
                ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "replaceNode":
                ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "ignoreTargetNode": break;
            default:
                throw new Error("Unknown renderMode: " + renderMode);
        }

        if (haveAddedNodesToParent) {
            activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
            if (options['afterRender'])
                ko.dependencyDetection.ignore(options['afterRender'], null, [renderedNodesArray, bindingContext['$data']]);
        }

        return renderedNodesArray;
    }

    function resolveTemplateName(template, data, context) {
        // The template can be specified as:
        if (ko.isObservable(template)) {
            // 1. An observable, with string value
            return template();
        } else if (typeof template === 'function') {
            // 2. A function of (data, context) returning a string
            return template(data, context);
        } else {
            // 3. A string
            return template;
        }
    }

    ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
        options = options || {};
        if ((options['templateEngine'] || _templateEngine) == undefined)
            throw new Error("Set a template engine before calling renderTemplate");
        renderMode = renderMode || "replaceChildren";

        if (targetNodeOrNodeArray) {
            var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

            var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
            var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

            return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes
                function () {
                    // Ensure we've got a proper binding context to work with
                    var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
                        ? dataOrBindingContext
                        : new ko.bindingContext(dataOrBindingContext, null, null, null, { "exportDependencies": true });

                    var templateName = resolveTemplateName(template, bindingContext['$data'], bindingContext),
                        renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);

                    if (renderMode == "replaceNode") {
                        targetNodeOrNodeArray = renderedNodesArray;
                        firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                    }
                },
                null,
                { disposeWhen: whenToDispose, disposeWhenNodeIsRemoved: activelyDisposeWhenNodeIsRemoved }
            );
        } else {
            // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
            return ko.memoization.memoize(function (domNode) {
                ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
            });
        }
    };

    ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
        // Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
        // activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
        var arrayItemContext;

        // This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
        var executeTemplateForArrayItem = function (arrayValue, index) {
            // Support selecting template as a function of the data being rendered
            arrayItemContext = parentBindingContext['createChildContext'](arrayValue, options['as'], function(context) {
                context['$index'] = index;
            });

            var templateName = resolveTemplateName(template, arrayValue, arrayItemContext);
            return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
        };

        // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
        var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
            activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
            if (options['afterRender'])
                options['afterRender'](addedNodesArray, arrayValue);

            // release the "cache" variable, so that it can be collected by
            // the GC when its value isn't used from within the bindings anymore.
            arrayItemContext = null;
        };

        return ko.dependentObservable(function () {
            var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            // Call setDomNodeChildrenFromArrayMapping, ignoring any observables unwrapped within (most likely from a callback function).
            // If the array items are observables, though, they will be unwrapped in executeTemplateForArrayItem and managed within setDomNodeChildrenFromArrayMapping.
            ko.dependencyDetection.ignore(ko.utils.setDomNodeChildrenFromArrayMapping, null, [targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback]);

        }, null, { disposeWhenNodeIsRemoved: targetNode });
    };

    var templateComputedDomDataKey = ko.utils.domData.nextKey();
    function disposeOldComputedAndStoreNewOne(element, newComputed) {
        var oldComputed = ko.utils.domData.get(element, templateComputedDomDataKey);
        if (oldComputed && (typeof(oldComputed.dispose) == 'function'))
            oldComputed.dispose();
        ko.utils.domData.set(element, templateComputedDomDataKey, (newComputed && newComputed.isActive()) ? newComputed : undefined);
    }

    ko.bindingHandlers['template'] = {
        'init': function(element, valueAccessor) {
            // Support anonymous templates
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            if (typeof bindingValue == "string" || bindingValue['name']) {
                // It's a named template - clear the element
                ko.virtualElements.emptyNode(element);
            } else if ('nodes' in bindingValue) {
                // We've been given an array of DOM nodes. Save them as the template source.
                // There is no known use case for the node array being an observable array (if the output
                // varies, put that behavior *into* your template - that's what templates are for), and
                // the implementation would be a mess, so assert that it's not observable.
                var nodes = bindingValue['nodes'] || [];
                if (ko.isObservable(nodes)) {
                    throw new Error('The "nodes" option must be a plain, non-observable array.');
                }
                var container = ko.utils.moveCleanedNodesToContainerElement(nodes); // This also removes the nodes from their current parent
                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
            } else {
                // It's an anonymous template - store the element contents, then clear the element
                var templateNodes = ko.virtualElements.childNodes(element),
                    container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
            }
            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor(),
                options = ko.utils.unwrapObservable(value),
                shouldDisplay = true,
                templateComputed = null,
                templateName;

            if (typeof options == "string") {
                templateName = value;
                options = {};
            } else {
                templateName = options['name'];

                // Support "if"/"ifnot" conditions
                if ('if' in options)
                    shouldDisplay = ko.utils.unwrapObservable(options['if']);
                if (shouldDisplay && 'ifnot' in options)
                    shouldDisplay = !ko.utils.unwrapObservable(options['ifnot']);
            }

            if ('foreach' in options) {
                // Render once for each data point (treating data set as empty if shouldDisplay==false)
                var dataArray = (shouldDisplay && options['foreach']) || [];
                templateComputed = ko.renderTemplateForEach(templateName || element, dataArray, options, element, bindingContext);
            } else if (!shouldDisplay) {
                ko.virtualElements.emptyNode(element);
            } else {
                // Render once for this single data point (or use the viewModel if no data was provided)
                var innerBindingContext = ('data' in options) ?
                    bindingContext.createStaticChildContext(options['data'], options['as']) :  // Given an explitit 'data' value, we create a child binding context for it
                    bindingContext;                                                        // Given no explicit 'data' value, we retain the same binding context
                templateComputed = ko.renderTemplate(templateName || element, innerBindingContext, options, element);
            }

            // It only makes sense to have a single template computed per element (otherwise which one should have its output displayed?)
            disposeOldComputedAndStoreNewOne(element, templateComputed);
        }
    };

    // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
    ko.expressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
        var parsedBindingValue = ko.expressionRewriting.parseObjectLiteral(bindingValue);

        if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
            return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)

        if (ko.expressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
            return null; // Named templates can be rewritten, so return "no error"
        return "This template engine does not support anonymous templates nested within its templates";
    };

    ko.virtualElements.allowedBindings['template'] = true;
})();

ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
ko.exportSymbol('renderTemplate', ko.renderTemplate);
// Go through the items that have been added and deleted and try to find matches between them.
ko.utils.findMovesInArrayComparison = function (left, right, limitFailedCompares) {
    if (left.length && right.length) {
        var failedCompares, l, r, leftItem, rightItem;
        for (failedCompares = l = 0; (!limitFailedCompares || failedCompares < limitFailedCompares) && (leftItem = left[l]); ++l) {
            for (r = 0; rightItem = right[r]; ++r) {
                if (leftItem['value'] === rightItem['value']) {
                    leftItem['moved'] = rightItem['index'];
                    rightItem['moved'] = leftItem['index'];
                    right.splice(r, 1);         // This item is marked as moved; so remove it from right list
                    failedCompares = r = 0;     // Reset failed compares count because we're checking for consecutive failures
                    break;
                }
            }
            failedCompares += r;
        }
    }
};

ko.utils.compareArrays = (function () {
    var statusNotInOld = 'added', statusNotInNew = 'deleted';

    // Simple calculation based on Levenshtein distance.
    function compareArrays(oldArray, newArray, options) {
        // For backward compatibility, if the third arg is actually a bool, interpret
        // it as the old parameter 'dontLimitMoves'. Newer code should use { dontLimitMoves: true }.
        options = (typeof options === 'boolean') ? { 'dontLimitMoves': options } : (options || {});
        oldArray = oldArray || [];
        newArray = newArray || [];

        if (oldArray.length < newArray.length)
            return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, options);
        else
            return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, options);
    }

    function compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, options) {
        var myMin = Math.min,
            myMax = Math.max,
            editDistanceMatrix = [],
            smlIndex, smlIndexMax = smlArray.length,
            bigIndex, bigIndexMax = bigArray.length,
            compareRange = (bigIndexMax - smlIndexMax) || 1,
            maxDistance = smlIndexMax + bigIndexMax + 1,
            thisRow, lastRow,
            bigIndexMaxForRow, bigIndexMinForRow;

        for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
            lastRow = thisRow;
            editDistanceMatrix.push(thisRow = []);
            bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
            bigIndexMinForRow = myMax(0, smlIndex - 1);
            for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
                if (!bigIndex)
                    thisRow[bigIndex] = smlIndex + 1;
                else if (!smlIndex)  // Top row - transform empty array into new array via additions
                    thisRow[bigIndex] = bigIndex + 1;
                else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1])
                    thisRow[bigIndex] = lastRow[bigIndex - 1];                  // copy value (no edit)
                else {
                    var northDistance = lastRow[bigIndex] || maxDistance;       // not in big (deletion)
                    var westDistance = thisRow[bigIndex - 1] || maxDistance;    // not in small (addition)
                    thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
                }
            }
        }

        var editScript = [], meMinusOne, notInSml = [], notInBig = [];
        for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
            meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
            if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex-1]) {
                notInSml.push(editScript[editScript.length] = {     // added
                    'status': statusNotInSml,
                    'value': bigArray[--bigIndex],
                    'index': bigIndex });
            } else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
                notInBig.push(editScript[editScript.length] = {     // deleted
                    'status': statusNotInBig,
                    'value': smlArray[--smlIndex],
                    'index': smlIndex });
            } else {
                --bigIndex;
                --smlIndex;
                if (!options['sparse']) {
                    editScript.push({
                        'status': "retained",
                        'value': bigArray[bigIndex] });
                }
            }
        }

        // Set a limit on the number of consecutive non-matching comparisons; having it a multiple of
        // smlIndexMax keeps the time complexity of this algorithm linear.
        ko.utils.findMovesInArrayComparison(notInBig, notInSml, !options['dontLimitMoves'] && smlIndexMax * 10);

        return editScript.reverse();
    }

    return compareArrays;
})();

ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);
(function () {
    // Objective:
    // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
    //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
    // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
    //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
    //   previously mapped - retain those nodes, and just insert/delete other ones

    // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
    // You can use this, for example, to activate bindings on those nodes.

    function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
        // Map this array value inside a dependentObservable so we re-map when any dependency changes
        var mappedNodes = [];
        var dependentObservable = ko.dependentObservable(function() {
            var newMappedNodes = mapping(valueToMap, index, ko.utils.fixUpContinuousNodeArray(mappedNodes, containerNode)) || [];

            // On subsequent evaluations, just replace the previously-inserted DOM nodes
            if (mappedNodes.length > 0) {
                ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                if (callbackAfterAddingNodes)
                    ko.dependencyDetection.ignore(callbackAfterAddingNodes, null, [valueToMap, newMappedNodes, index]);
            }

            // Replace the contents of the mappedNodes array, thereby updating the record
            // of which nodes would be deleted if valueToMap was itself later removed
            mappedNodes.length = 0;
            ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
        }, null, { disposeWhenNodeIsRemoved: containerNode, disposeWhen: function() { return !ko.utils.anyDomNodeIsAttachedToDocument(mappedNodes); } });
        return { mappedNodes : mappedNodes, dependentObservable : (dependentObservable.isActive() ? dependentObservable : undefined) };
    }

    var lastMappingResultDomDataKey = ko.utils.domData.nextKey(),
        deletedItemDummyValue = ko.utils.domData.nextKey();

    ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
        // Compare the provided array against the previous one
        array = array || [];
        options = options || {};
        var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
        var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
        var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
        var editScript = ko.utils.compareArrays(lastArray, array, options['dontLimitMoves']);

        // Build the new mapping result
        var newMappingResult = [];
        var lastMappingResultIndex = 0;
        var newMappingResultIndex = 0;

        var nodesToDelete = [];
        var itemsToProcess = [];
        var itemsForBeforeRemoveCallbacks = [];
        var itemsForMoveCallbacks = [];
        var itemsForAfterAddCallbacks = [];
        var mapData;

        function itemMovedOrRetained(editScriptIndex, oldPosition) {
            mapData = lastMappingResult[oldPosition];
            if (newMappingResultIndex !== oldPosition)
                itemsForMoveCallbacks[editScriptIndex] = mapData;
            // Since updating the index might change the nodes, do so before calling fixUpContinuousNodeArray
            mapData.indexObservable(newMappingResultIndex++);
            ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode);
            newMappingResult.push(mapData);
            itemsToProcess.push(mapData);
        }

        function callCallback(callback, items) {
            if (callback) {
                for (var i = 0, n = items.length; i < n; i++) {
                    if (items[i]) {
                        ko.utils.arrayForEach(items[i].mappedNodes, function(node) {
                            callback(node, i, items[i].arrayEntry);
                        });
                    }
                }
            }
        }

        for (var i = 0, editScriptItem, movedIndex; editScriptItem = editScript[i]; i++) {
            movedIndex = editScriptItem['moved'];
            switch (editScriptItem['status']) {
                case "deleted":
                    if (movedIndex === undefined) {
                        mapData = lastMappingResult[lastMappingResultIndex];

                        // Stop tracking changes to the mapping for these nodes
                        if (mapData.dependentObservable) {
                            mapData.dependentObservable.dispose();
                            mapData.dependentObservable = undefined;
                        }

                        // Queue these nodes for later removal
                        if (ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode).length) {
                            if (options['beforeRemove']) {
                                newMappingResult.push(mapData);
                                itemsToProcess.push(mapData);
                                if (mapData.arrayEntry === deletedItemDummyValue) {
                                    mapData = null;
                                } else {
                                    itemsForBeforeRemoveCallbacks[i] = mapData;
                                }
                            }
                            if (mapData) {
                                nodesToDelete.push.apply(nodesToDelete, mapData.mappedNodes);
                            }
                        }
                    }
                    lastMappingResultIndex++;
                    break;

                case "retained":
                    itemMovedOrRetained(i, lastMappingResultIndex++);
                    break;

                case "added":
                    if (movedIndex !== undefined) {
                        itemMovedOrRetained(i, movedIndex);
                    } else {
                        mapData = { arrayEntry: editScriptItem['value'], indexObservable: ko.observable(newMappingResultIndex++) };
                        newMappingResult.push(mapData);
                        itemsToProcess.push(mapData);
                        if (!isFirstExecution)
                            itemsForAfterAddCallbacks[i] = mapData;
                    }
                    break;
            }
        }

        // Store a copy of the array items we just considered so we can difference it next time
        ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);

        // Call beforeMove first before any changes have been made to the DOM
        callCallback(options['beforeMove'], itemsForMoveCallbacks);

        // Next remove nodes for deleted items (or just clean if there's a beforeRemove callback)
        ko.utils.arrayForEach(nodesToDelete, options['beforeRemove'] ? ko.cleanNode : ko.removeNode);

        // Next add/reorder the remaining items (will include deleted items if there's a beforeRemove callback)
        for (var i = 0, nextNode = ko.virtualElements.firstChild(domNode), lastNode, node; mapData = itemsToProcess[i]; i++) {
            // Get nodes for newly added items
            if (!mapData.mappedNodes)
                ko.utils.extend(mapData, mapNodeAndRefreshWhenChanged(domNode, mapping, mapData.arrayEntry, callbackAfterAddingNodes, mapData.indexObservable));

            // Put nodes in the right place if they aren't there already
            for (var j = 0; node = mapData.mappedNodes[j]; nextNode = node.nextSibling, lastNode = node, j++) {
                if (node !== nextNode)
                    ko.virtualElements.insertAfter(domNode, node, lastNode);
            }

            // Run the callbacks for newly added nodes (for example, to apply bindings, etc.)
            if (!mapData.initialized && callbackAfterAddingNodes) {
                callbackAfterAddingNodes(mapData.arrayEntry, mapData.mappedNodes, mapData.indexObservable);
                mapData.initialized = true;
            }
        }

        // If there's a beforeRemove callback, call it after reordering.
        // Note that we assume that the beforeRemove callback will usually be used to remove the nodes using
        // some sort of animation, which is why we first reorder the nodes that will be removed. If the
        // callback instead removes the nodes right away, it would be more efficient to skip reordering them.
        // Perhaps we'll make that change in the future if this scenario becomes more common.
        callCallback(options['beforeRemove'], itemsForBeforeRemoveCallbacks);

        // Replace the stored values of deleted items with a dummy value. This provides two benefits: it marks this item
        // as already "removed" so we won't call beforeRemove for it again, and it ensures that the item won't match up
        // with an actual item in the array and appear as "retained" or "moved".
        for (i = 0; i < itemsForBeforeRemoveCallbacks.length; ++i) {
            if (itemsForBeforeRemoveCallbacks[i]) {
                itemsForBeforeRemoveCallbacks[i].arrayEntry = deletedItemDummyValue;
            }
        }

        // Finally call afterMove and afterAdd callbacks
        callCallback(options['afterMove'], itemsForMoveCallbacks);
        callCallback(options['afterAdd'], itemsForAfterAddCallbacks);
    };
})();

ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
ko.nativeTemplateEngine = function () {
    this['allowTemplateRewriting'] = false;
};

ko.nativeTemplateEngine.prototype = new ko.templateEngine();
ko.nativeTemplateEngine.prototype.constructor = ko.nativeTemplateEngine;
ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options, templateDocument) {
    var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
        templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
        templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

    if (templateNodes) {
        return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
    } else {
        var templateText = templateSource['text']();
        return ko.utils.parseHtmlFragment(templateText, templateDocument);
    }
};

ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
(function() {
    ko.jqueryTmplTemplateEngine = function () {
        // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
        // doesn't expose a version number, so we have to infer it.
        // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
        // which KO internally refers to as version "2", so older versions are no longer detected.
        var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
            if (!jQueryInstance || !(jQueryInstance['tmpl']))
                return 0;
            // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
            try {
                if (jQueryInstance['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                    // Since 1.0.0pre, custom tags should append markup to an array called "__"
                    return 2; // Final version of jquery.tmpl
                }
            } catch(ex) { /* Apparently not the version we were looking for */ }

            return 1; // Any older version that we don't support
        })();

        function ensureHasReferencedJQueryTemplates() {
            if (jQueryTmplVersion < 2)
                throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
        }

        function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
            return jQueryInstance['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
        }

        this['renderTemplateSource'] = function(templateSource, bindingContext, options, templateDocument) {
            templateDocument = templateDocument || document;
            options = options || {};
            ensureHasReferencedJQueryTemplates();

            // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
            var precompiled = templateSource['data']('precompiled');
            if (!precompiled) {
                var templateText = templateSource['text']() || "";
                // Wrap in "with($whatever.koBindingContext) { ... }"
                templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

                precompiled = jQueryInstance['template'](null, templateText);
                templateSource['data']('precompiled', precompiled);
            }

            var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
            var jQueryTemplateOptions = jQueryInstance['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

            var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
            resultNodes['appendTo'](templateDocument.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work

            jQueryInstance['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
            return resultNodes;
        };

        this['createJavaScriptEvaluatorBlock'] = function(script) {
            return "{{ko_code ((function() { return " + script + " })()) }}";
        };

        this['addTemplate'] = function(templateName, templateMarkup) {
            document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
        };

        if (jQueryTmplVersion > 0) {
            jQueryInstance['tmpl']['tag']['ko_code'] = {
                open: "__.push($1 || '');"
            };
            jQueryInstance['tmpl']['tag']['ko_with'] = {
                open: "with($1) {",
                close: "} "
            };
        }
    };

    ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();
    ko.jqueryTmplTemplateEngine.prototype.constructor = ko.jqueryTmplTemplateEngine;

    // Use this one by default *only if jquery.tmpl is referenced*
    var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
    if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
        ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

    ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
})();
}));
}());
})();
});

class KnockoutService {

    static registerComponent(name, viewModel, template) {
        const componentConfig = {
            template: template,
            viewModel: viewModel
        };

        knockoutLatest_debug.components.register(name, componentConfig);
    }
}

var template = "﻿<div class=\"dashboard\" data-bind=\"foreach: tasks\">\r\n    <div class=\"task\">\r\n        <h3>Task</h3><i data-bind=\"text: question\"></i>\r\n        <div data-bind=\"html: answer\"></div>\r\n        \r\n        <div data-bind=\"if: component\">\r\n            <div data-bind=\"component: component\"></div>\r\n        </div>\r\n        \r\n        <ezy-rate-task></ezy-rate-task>\r\n    </div>\r\n</div>";

class Dashboard {

    constructor() {
        const self = this;

        const viewModel = function () {
            this.tasks = knockoutLatest_debug.observableArray(self.getTasks());
        };

        KnockoutService.registerComponent("ezy-dashboard", viewModel, template);
    }

    getTasks() {
        var tasks = [];
        tasks.push({
            question: "Two separate .NET systems are set up to validate MD5 keys (or SHA1 etc) from a database. The MD5 keys are generated from a list of employee names. The validation is matching 100% on one system, but only 95% on the other system. What is the most probable reason for this?",
            answer: "Some answer <b>Some thing</b>",
            component: null
        });
        tasks.push({
            question: "The code below is used in an ASP.NET application where ”GreetingService.CurrentGreeting”is fetched at the following times: 08, 12 and 16. Which message is returned on each run?",
            answer: "text",
            component: null
        });
        tasks.push({
            question: "Entity Framework is used to fetch data from a table in a database and display the result with a text header that shows the total number of rows returned in the result. Which of the following versions would you suggest, and why?",
            answer: "Some answer 2",
            component: null
        });
        tasks.push({
            question: "Under which circumstances is the in-memory (default) Cache in ASP.NET cleared?",
            answer: "When the Application Pool is recycled.",
            component: null
        });
        tasks.push({
            question: "What is clean code? Please describe key points you use in your everyday work.",
            answer: "Some answer 2",
            component: null
        });
        tasks.push({
            question: "We have problem with scrapers doing a lot of searches on the site. We want to generate a list of ips that do unusual amount of searches, and also have the ability to block them. Imagine “Search” below being called very often by many users at the same time. What potential problems can we run into?",
            answer: "Some answer 2",
            component: null
        });
        tasks.push({
            question: "Take a look at the following badly written page. Please rewrite it as you would have done it, it don’t need to be exactly the same result, but similar. You can change any code that you don’t think is well done and reapply it in a different way. Use best practices regarding HTML, JS, CSS but also regarding architecture and performance.  Using for example javascript module pattern and optionally KnockoutJS or other framework to bind the JS with html.",
            answer: "Created a Knockout component. Please see /ui/app/",
            component: "ezy-better-example"
        });
        tasks.push({
            question: "Create a web page with a button. When you click on the button the application should retrieve the currency rates for USD and EUR and display them on the page. Currency rates can be found on: http://www.forex.se/ratesxml.asp?id=492. Please use ASP.NET Mvc Project that calls via AJAX either calls a webapi method or a jsonresult method, that's consuming the exchange service. Please think of how you structure your code.Use: MVC, Javascript Modulepattern, async calls, Knockoutjs (optional)",
            answer: "Created a Knockout component. Please see /ui/app/",
            component: "ezy-exchange-rates"
        });

        return tasks;
    }
}

var template$1 = "﻿<div class=\"exchange-rates\">\r\n    Fetch exchange rates\r\n    <p data-bind=\"text: rate\"></p>\r\n</div>";

class ExchangeRates {

    constructor() {

        let self = this;

        const viewModel = function () {
            this.rate = knockoutLatest_debug.observable(self.getExchangeRates());
        };

        KnockoutService.registerComponent("ezy-exchange-rates", viewModel, template$1);
    }

    getExchangeRates() {
        return "1001112";
    }
}

var template$2 = "<script>\r\n    document.write('<h1>The fantastic javascript example</h1>')\r\n    function alertMe(i) {\r\n        if (i == 5) {\r\n            alert('five');\r\n        } else {\r\n            alert(i);\r\n        }\r\n    }\r\n\r\n    function LoadList() {\r\n        $(\".THELIST\").empty();\r\n\r\n        for (i = 0; i < 10; i++) {\r\n            newElem = $(\"<li><a href='#'>\" + i + \"</a></li>\");\r\n            newElem.click(function () {\r\n                alertMe(i);\r\n            });\r\n            $(\".THELIST\").append(newElem);\r\n        }\r\n    }\r\n\r\n    $(\"#Clock\").text(Date());\r\n    setTimeout(tooLong, 30000);\r\n\r\n    function tooLong() {\r\n        alert('you have now been on the page for half a minute');\r\n    }\r\n</script>\r\n<h1>List</h1>\r\n<table border=\"1\">\r\n    <tr>\r\n        <td style=\"width: 200px;\"> <a href=\"javascript:LoadList();\">Read list to the right</a> </td>\r\n        <td>\r\n            <ul class=\"THELIST \"> </ul>\r\n        </td>\r\n    </tr>\r\n</table>\r\n<p>Time is: <span id=\"Clock\"></span></p>";

class BetterExample {

    constructor() {
        var self = this;

        const viewModel = function () {
            this.currentDateTime = knockoutLatest_debug.observable(new Date());
        };

        KnockoutService.registerComponent("ezy-better-example", viewModel, template$2);
    }

}

var template$3 = "﻿<div class=\"rate-task\">\r\n     <div class=\"rate-task__title\">Do you approve this answer?</div>\r\n     <button class=\"btn btn-success\" type=\"button\" data-bind=\"click: approveTask\">Yes</button>\r\n     <button class=\"btn btn-warning\" type=\"button\" data-bind=\"click: disapproveTask\">No</button>\r\n     <textarea data-bind=\"visible: approved() == false\" placeholder=\"Please specify the reason why it's not approved\"></textarea>\r\n</div>";

class RateTask {

    constructor() {

        const viewModel = function () {
            var self = this;

            this.approved = knockoutLatest_debug.observable(null);
            this.approveTask = function () {
                this.approved(true);
            };
            this.disapproveTask = function () {
                this.approved(false);
            };
        };

        KnockoutService.registerComponent("ezy-rate-task", viewModel, template$3);
    }
}

activateKnockoutComponents();

function activateKnockoutComponents() {
    var dash = new Dashboard();
    var exchangeRates = new ExchangeRates();
    var betterExample = new BetterExample();
    var rateTask = new RateTask();

    knockoutLatest_debug.applyBindings();
}

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0cy5idW5kbGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9rbm9ja291dC9idWlsZC9vdXRwdXQva25vY2tvdXQtbGF0ZXN0LmRlYnVnLmpzIiwiLi4vYXBwL3NlcnZpY2VzL2tub2Nrb3V0LnNlcnZpY2UuanMiLCIuLi9hcHAvZGFzaGJvYXJkL2Rhc2hib2FyZC5qcyIsIi4uL2FwcC9leGNoYW5nZS1yYXRlcy9leGNoYW5nZS1yYXRlcy5qcyIsIi4uL2FwcC9iZXR0ZXItZXhhbXBsZS9iZXR0ZXItZXhhbXBsZS5qcyIsIi4uL2FwcC9yYXRlLXRhc2svcmF0ZS10YXNrLmpzIiwiLi4vYXBwL2VudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogS25vY2tvdXQgSmF2YVNjcmlwdCBsaWJyYXJ5IHYzLjQuMVxuICogKGMpIFRoZSBLbm9ja291dC5qcyB0ZWFtIC0gaHR0cDovL2tub2Nrb3V0anMuY29tL1xuICogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiAqL1xuXG4oZnVuY3Rpb24oKXtcbnZhciBERUJVRz10cnVlO1xuKGZ1bmN0aW9uKHVuZGVmaW5lZCl7XG4gICAgLy8gKDAsIGV2YWwpKCd0aGlzJykgaXMgYSByb2J1c3Qgd2F5IG9mIGdldHRpbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3RcbiAgICAvLyBGb3IgZGV0YWlscywgc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTQxMTk5ODgvcmV0dXJuLXRoaXMtMC1ldmFsdGhpcy8xNDEyMDAyMyMxNDEyMDAyM1xuICAgIHZhciB3aW5kb3cgPSB0aGlzIHx8ICgwLCBldmFsKSgndGhpcycpLFxuICAgICAgICBkb2N1bWVudCA9IHdpbmRvd1snZG9jdW1lbnQnXSxcbiAgICAgICAgbmF2aWdhdG9yID0gd2luZG93WyduYXZpZ2F0b3InXSxcbiAgICAgICAgalF1ZXJ5SW5zdGFuY2UgPSB3aW5kb3dbXCJqUXVlcnlcIl0sXG4gICAgICAgIEpTT04gPSB3aW5kb3dbXCJKU09OXCJdO1xuKGZ1bmN0aW9uKGZhY3RvcnkpIHtcbiAgICAvLyBTdXBwb3J0IHRocmVlIG1vZHVsZSBsb2FkaW5nIHNjZW5hcmlvc1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZVsnYW1kJ10pIHtcbiAgICAgICAgLy8gWzFdIEFNRCBhbm9ueW1vdXMgbW9kdWxlXG4gICAgICAgIGRlZmluZShbJ2V4cG9ydHMnLCAncmVxdWlyZSddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBbMl0gQ29tbW9uSlMvTm9kZS5qc1xuICAgICAgICBmYWN0b3J5KG1vZHVsZVsnZXhwb3J0cyddIHx8IGV4cG9ydHMpOyAgLy8gbW9kdWxlLmV4cG9ydHMgaXMgZm9yIE5vZGUuanNcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBbM10gTm8gbW9kdWxlIGxvYWRlciAocGxhaW4gPHNjcmlwdD4gdGFnKSAtIHB1dCBkaXJlY3RseSBpbiBnbG9iYWwgbmFtZXNwYWNlXG4gICAgICAgIGZhY3Rvcnkod2luZG93WydrbyddID0ge30pO1xuICAgIH1cbn0oZnVuY3Rpb24oa29FeHBvcnRzLCBhbWRSZXF1aXJlKXtcbi8vIEludGVybmFsbHksIGFsbCBLTyBvYmplY3RzIGFyZSBhdHRhY2hlZCB0byBrb0V4cG9ydHMgKGV2ZW4gdGhlIG5vbi1leHBvcnRlZCBvbmVzIHdob3NlIG5hbWVzIHdpbGwgYmUgbWluaWZpZWQgYnkgdGhlIGNsb3N1cmUgY29tcGlsZXIpLlxuLy8gSW4gdGhlIGZ1dHVyZSwgdGhlIGZvbGxvd2luZyBcImtvXCIgdmFyaWFibGUgbWF5IGJlIG1hZGUgZGlzdGluY3QgZnJvbSBcImtvRXhwb3J0c1wiIHNvIHRoYXQgcHJpdmF0ZSBvYmplY3RzIGFyZSBub3QgZXh0ZXJuYWxseSByZWFjaGFibGUuXG52YXIga28gPSB0eXBlb2Yga29FeHBvcnRzICE9PSAndW5kZWZpbmVkJyA/IGtvRXhwb3J0cyA6IHt9O1xuLy8gR29vZ2xlIENsb3N1cmUgQ29tcGlsZXIgaGVscGVycyAodXNlZCBvbmx5IHRvIG1ha2UgdGhlIG1pbmlmaWVkIGZpbGUgc21hbGxlcilcbmtvLmV4cG9ydFN5bWJvbCA9IGZ1bmN0aW9uKGtvUGF0aCwgb2JqZWN0KSB7XG4gICAgdmFyIHRva2VucyA9IGtvUGF0aC5zcGxpdChcIi5cIik7XG5cbiAgICAvLyBJbiB0aGUgZnV0dXJlLCBcImtvXCIgbWF5IGJlY29tZSBkaXN0aW5jdCBmcm9tIFwia29FeHBvcnRzXCIgKHNvIHRoYXQgbm9uLWV4cG9ydGVkIG9iamVjdHMgYXJlIG5vdCByZWFjaGFibGUpXG4gICAgLy8gQXQgdGhhdCBwb2ludCwgXCJ0YXJnZXRcIiB3b3VsZCBiZSBzZXQgdG86ICh0eXBlb2Yga29FeHBvcnRzICE9PSBcInVuZGVmaW5lZFwiID8ga29FeHBvcnRzIDoga28pXG4gICAgdmFyIHRhcmdldCA9IGtvO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoIC0gMTsgaSsrKVxuICAgICAgICB0YXJnZXQgPSB0YXJnZXRbdG9rZW5zW2ldXTtcbiAgICB0YXJnZXRbdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXV0gPSBvYmplY3Q7XG59O1xua28uZXhwb3J0UHJvcGVydHkgPSBmdW5jdGlvbihvd25lciwgcHVibGljTmFtZSwgb2JqZWN0KSB7XG4gICAgb3duZXJbcHVibGljTmFtZV0gPSBvYmplY3Q7XG59O1xua28udmVyc2lvbiA9IFwiMy40LjFcIjtcblxua28uZXhwb3J0U3ltYm9sKCd2ZXJzaW9uJywga28udmVyc2lvbik7XG4vLyBGb3IgYW55IG9wdGlvbnMgdGhhdCBtYXkgYWZmZWN0IHZhcmlvdXMgYXJlYXMgb2YgS25vY2tvdXQgYW5kIGFyZW4ndCBkaXJlY3RseSBhc3NvY2lhdGVkIHdpdGggZGF0YSBiaW5kaW5nLlxua28ub3B0aW9ucyA9IHtcbiAgICAnZGVmZXJVcGRhdGVzJzogZmFsc2UsXG4gICAgJ3VzZU9ubHlOYXRpdmVFdmVudHMnOiBmYWxzZVxufTtcblxuLy9rby5leHBvcnRTeW1ib2woJ29wdGlvbnMnLCBrby5vcHRpb25zKTsgICAvLyAnb3B0aW9ucycgaXNuJ3QgbWluaWZpZWRcbmtvLnV0aWxzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBvYmplY3RGb3JFYWNoKG9iaiwgYWN0aW9uKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uKHByb3AsIG9ialtwcm9wXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRlbmQodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgICAgZm9yKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGlmKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0UHJvdG90eXBlT2Yob2JqLCBwcm90bykge1xuICAgICAgICBvYmouX19wcm90b19fID0gcHJvdG87XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgdmFyIGNhblNldFByb3RvdHlwZSA9ICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICB2YXIgY2FuVXNlU3ltYm9scyA9ICFERUJVRyAmJiB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nO1xuXG4gICAgLy8gUmVwcmVzZW50IHRoZSBrbm93biBldmVudCB0eXBlcyBpbiBhIGNvbXBhY3Qgd2F5LCB0aGVuIGF0IHJ1bnRpbWUgdHJhbnNmb3JtIGl0IGludG8gYSBoYXNoIHdpdGggZXZlbnQgbmFtZSBhcyBrZXkgKGZvciBmYXN0IGxvb2t1cClcbiAgICB2YXIga25vd25FdmVudHMgPSB7fSwga25vd25FdmVudFR5cGVzQnlFdmVudE5hbWUgPSB7fTtcbiAgICB2YXIga2V5RXZlbnRUeXBlTmFtZSA9IChuYXZpZ2F0b3IgJiYgL0ZpcmVmb3hcXC8yL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkgPyAnS2V5Ym9hcmRFdmVudCcgOiAnVUlFdmVudHMnO1xuICAgIGtub3duRXZlbnRzW2tleUV2ZW50VHlwZU5hbWVdID0gWydrZXl1cCcsICdrZXlkb3duJywgJ2tleXByZXNzJ107XG4gICAga25vd25FdmVudHNbJ01vdXNlRXZlbnRzJ10gPSBbJ2NsaWNrJywgJ2RibGNsaWNrJywgJ21vdXNlZG93bicsICdtb3VzZXVwJywgJ21vdXNlbW92ZScsICdtb3VzZW92ZXInLCAnbW91c2VvdXQnLCAnbW91c2VlbnRlcicsICdtb3VzZWxlYXZlJ107XG4gICAgb2JqZWN0Rm9yRWFjaChrbm93bkV2ZW50cywgZnVuY3Rpb24oZXZlbnRUeXBlLCBrbm93bkV2ZW50c0ZvclR5cGUpIHtcbiAgICAgICAgaWYgKGtub3duRXZlbnRzRm9yVHlwZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0ga25vd25FdmVudHNGb3JUeXBlLmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICBrbm93bkV2ZW50VHlwZXNCeUV2ZW50TmFtZVtrbm93bkV2ZW50c0ZvclR5cGVbaV1dID0gZXZlbnRUeXBlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGV2ZW50c1RoYXRNdXN0QmVSZWdpc3RlcmVkVXNpbmdBdHRhY2hFdmVudCA9IHsgJ3Byb3BlcnR5Y2hhbmdlJzogdHJ1ZSB9OyAvLyBXb3JrYXJvdW5kIGZvciBhbiBJRTkgaXNzdWUgLSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzQwNlxuXG4gICAgLy8gRGV0ZWN0IElFIHZlcnNpb25zIGZvciBidWcgd29ya2Fyb3VuZHMgKHVzZXMgSUUgY29uZGl0aW9uYWxzLCBub3QgVUEgc3RyaW5nLCBmb3Igcm9idXN0bmVzcylcbiAgICAvLyBOb3RlIHRoYXQsIHNpbmNlIElFIDEwIGRvZXMgbm90IHN1cHBvcnQgY29uZGl0aW9uYWwgY29tbWVudHMsIHRoZSBmb2xsb3dpbmcgbG9naWMgb25seSBkZXRlY3RzIElFIDwgMTAuXG4gICAgLy8gQ3VycmVudGx5IHRoaXMgaXMgYnkgZGVzaWduLCBzaW5jZSBJRSAxMCsgYmVoYXZlcyBjb3JyZWN0bHkgd2hlbiB0cmVhdGVkIGFzIGEgc3RhbmRhcmQgYnJvd3Nlci5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIGZ1dHVyZSBuZWVkIHRvIGRldGVjdCBzcGVjaWZpYyB2ZXJzaW9ucyBvZiBJRTEwKywgd2Ugd2lsbCBhbWVuZCB0aGlzLlxuICAgIHZhciBpZVZlcnNpb24gPSBkb2N1bWVudCAmJiAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gMywgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIGlFbGVtcyA9IGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaScpO1xuXG4gICAgICAgIC8vIEtlZXAgY29uc3RydWN0aW5nIGNvbmRpdGlvbmFsIEhUTUwgYmxvY2tzIHVudGlsIHdlIGhpdCBvbmUgdGhhdCByZXNvbHZlcyB0byBhbiBlbXB0eSBmcmFnbWVudFxuICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gJzwhLS1baWYgZ3QgSUUgJyArICgrK3ZlcnNpb24pICsgJ10+PGk+PC9pPjwhW2VuZGlmXS0tPicsXG4gICAgICAgICAgICBpRWxlbXNbMF1cbiAgICAgICAgKSB7fVxuICAgICAgICByZXR1cm4gdmVyc2lvbiA+IDQgPyB2ZXJzaW9uIDogdW5kZWZpbmVkO1xuICAgIH0oKSk7XG4gICAgdmFyIGlzSWU2ID0gaWVWZXJzaW9uID09PSA2LFxuICAgICAgICBpc0llNyA9IGllVmVyc2lvbiA9PT0gNztcblxuICAgIGZ1bmN0aW9uIGlzQ2xpY2tPbkNoZWNrYWJsZUVsZW1lbnQoZWxlbWVudCwgZXZlbnRUeXBlKSB7XG4gICAgICAgIGlmICgoa28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnQpICE9PSBcImlucHV0XCIpIHx8ICFlbGVtZW50LnR5cGUpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKGV2ZW50VHlwZS50b0xvd2VyQ2FzZSgpICE9IFwiY2xpY2tcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgaW5wdXRUeXBlID0gZWxlbWVudC50eXBlO1xuICAgICAgICByZXR1cm4gKGlucHV0VHlwZSA9PSBcImNoZWNrYm94XCIpIHx8IChpbnB1dFR5cGUgPT0gXCJyYWRpb1wiKTtcbiAgICB9XG5cbiAgICAvLyBGb3IgZGV0YWlscyBvbiB0aGUgcGF0dGVybiBmb3IgY2hhbmdpbmcgbm9kZSBjbGFzc2VzXG4gICAgLy8gc2VlOiBodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvaXNzdWVzLzE1OTdcbiAgICB2YXIgY3NzQ2xhc3NOYW1lUmVnZXggPSAvXFxTKy9nO1xuXG4gICAgZnVuY3Rpb24gdG9nZ2xlRG9tTm9kZUNzc0NsYXNzKG5vZGUsIGNsYXNzTmFtZXMsIHNob3VsZEhhdmVDbGFzcykge1xuICAgICAgICB2YXIgYWRkT3JSZW1vdmVGbjtcbiAgICAgICAgaWYgKGNsYXNzTmFtZXMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZS5jbGFzc0xpc3QgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgYWRkT3JSZW1vdmVGbiA9IG5vZGUuY2xhc3NMaXN0W3Nob3VsZEhhdmVDbGFzcyA/ICdhZGQnIDogJ3JlbW92ZSddO1xuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChjbGFzc05hbWVzLm1hdGNoKGNzc0NsYXNzTmFtZVJlZ2V4KSwgZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZE9yUmVtb3ZlRm4uY2FsbChub2RlLmNsYXNzTGlzdCwgY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG5vZGUuY2xhc3NOYW1lWydiYXNlVmFsJ10gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgLy8gU1ZHIHRhZyAuY2xhc3NOYW1lcyBpcyBhbiBTVkdBbmltYXRlZFN0cmluZyBpbnN0YW5jZVxuICAgICAgICAgICAgICAgIHRvZ2dsZU9iamVjdENsYXNzUHJvcGVydHlTdHJpbmcobm9kZS5jbGFzc05hbWUsICdiYXNlVmFsJywgY2xhc3NOYW1lcywgc2hvdWxkSGF2ZUNsYXNzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gbm9kZS5jbGFzc05hbWUgb3VnaHQgdG8gYmUgYSBzdHJpbmcuXG4gICAgICAgICAgICAgICAgdG9nZ2xlT2JqZWN0Q2xhc3NQcm9wZXJ0eVN0cmluZyhub2RlLCAnY2xhc3NOYW1lJywgY2xhc3NOYW1lcywgc2hvdWxkSGF2ZUNsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZU9iamVjdENsYXNzUHJvcGVydHlTdHJpbmcob2JqLCBwcm9wLCBjbGFzc05hbWVzLCBzaG91bGRIYXZlQ2xhc3MpIHtcbiAgICAgICAgLy8gb2JqL3Byb3AgaXMgZWl0aGVyIGEgbm9kZS8nY2xhc3NOYW1lJyBvciBhIFNWR0FuaW1hdGVkU3RyaW5nLydiYXNlVmFsJy5cbiAgICAgICAgdmFyIGN1cnJlbnRDbGFzc05hbWVzID0gb2JqW3Byb3BdLm1hdGNoKGNzc0NsYXNzTmFtZVJlZ2V4KSB8fCBbXTtcbiAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGNsYXNzTmFtZXMubWF0Y2goY3NzQ2xhc3NOYW1lUmVnZXgpLCBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmFkZE9yUmVtb3ZlSXRlbShjdXJyZW50Q2xhc3NOYW1lcywgY2xhc3NOYW1lLCBzaG91bGRIYXZlQ2xhc3MpO1xuICAgICAgICB9KTtcbiAgICAgICAgb2JqW3Byb3BdID0gY3VycmVudENsYXNzTmFtZXMuam9pbihcIiBcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmllbGRzSW5jbHVkZWRXaXRoSnNvblBvc3Q6IFsnYXV0aGVudGljaXR5X3Rva2VuJywgL15fX1JlcXVlc3RWZXJpZmljYXRpb25Ub2tlbihfLiopPyQvXSxcblxuICAgICAgICBhcnJheUZvckVhY2g6IGZ1bmN0aW9uIChhcnJheSwgYWN0aW9uKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICBhY3Rpb24oYXJyYXlbaV0sIGkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5SW5kZXhPZjogZnVuY3Rpb24gKGFycmF5LCBpdGVtKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChhcnJheSwgaXRlbSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFycmF5Lmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5Rmlyc3Q6IGZ1bmN0aW9uIChhcnJheSwgcHJlZGljYXRlLCBwcmVkaWNhdGVPd25lcikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKHByZWRpY2F0ZU93bmVyLCBhcnJheVtpXSwgaSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheVtpXTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5UmVtb3ZlSXRlbTogZnVuY3Rpb24gKGFycmF5LCBpdGVtVG9SZW1vdmUpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZihhcnJheSwgaXRlbVRvUmVtb3ZlKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICBhcnJheS5zaGlmdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGFycmF5R2V0RGlzdGluY3RWYWx1ZXM6IGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICAgICAgYXJyYXkgPSBhcnJheSB8fCBbXTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtvLnV0aWxzLmFycmF5SW5kZXhPZihyZXN1bHQsIGFycmF5W2ldKSA8IDApXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGFycmF5W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJyYXlNYXA6IGZ1bmN0aW9uIChhcnJheSwgbWFwcGluZykge1xuICAgICAgICAgICAgYXJyYXkgPSBhcnJheSB8fCBbXTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG1hcHBpbmcoYXJyYXlbaV0sIGkpKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJyYXlGaWx0ZXI6IGZ1bmN0aW9uIChhcnJheSwgcHJlZGljYXRlKSB7XG4gICAgICAgICAgICBhcnJheSA9IGFycmF5IHx8IFtdO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBhcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpXSwgaSkpXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGFycmF5W2ldKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJyYXlQdXNoQWxsOiBmdW5jdGlvbiAoYXJyYXksIHZhbHVlc1RvUHVzaCkge1xuICAgICAgICAgICAgaWYgKHZhbHVlc1RvUHVzaCBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2guYXBwbHkoYXJyYXksIHZhbHVlc1RvUHVzaCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSB2YWx1ZXNUb1B1c2gubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHZhbHVlc1RvUHVzaFtpXSk7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkT3JSZW1vdmVJdGVtOiBmdW5jdGlvbihhcnJheSwgdmFsdWUsIGluY2x1ZGVkKSB7XG4gICAgICAgICAgICB2YXIgZXhpc3RpbmdFbnRyeUluZGV4ID0ga28udXRpbHMuYXJyYXlJbmRleE9mKGtvLnV0aWxzLnBlZWtPYnNlcnZhYmxlKGFycmF5KSwgdmFsdWUpO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nRW50cnlJbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5jbHVkZWQpXG4gICAgICAgICAgICAgICAgICAgIGFycmF5LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIWluY2x1ZGVkKVxuICAgICAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UoZXhpc3RpbmdFbnRyeUluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjYW5TZXRQcm90b3R5cGU6IGNhblNldFByb3RvdHlwZSxcblxuICAgICAgICBleHRlbmQ6IGV4dGVuZCxcblxuICAgICAgICBzZXRQcm90b3R5cGVPZjogc2V0UHJvdG90eXBlT2YsXG5cbiAgICAgICAgc2V0UHJvdG90eXBlT2ZPckV4dGVuZDogY2FuU2V0UHJvdG90eXBlID8gc2V0UHJvdG90eXBlT2YgOiBleHRlbmQsXG5cbiAgICAgICAgb2JqZWN0Rm9yRWFjaDogb2JqZWN0Rm9yRWFjaCxcblxuICAgICAgICBvYmplY3RNYXA6IGZ1bmN0aW9uKHNvdXJjZSwgbWFwcGluZykge1xuICAgICAgICAgICAgaWYgKCFzb3VyY2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSBtYXBwaW5nKHNvdXJjZVtwcm9wXSwgcHJvcCwgc291cmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGVtcHR5RG9tTm9kZTogZnVuY3Rpb24gKGRvbU5vZGUpIHtcbiAgICAgICAgICAgIHdoaWxlIChkb21Ob2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICBrby5yZW1vdmVOb2RlKGRvbU5vZGUuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbW92ZUNsZWFuZWROb2Rlc1RvQ29udGFpbmVyRWxlbWVudDogZnVuY3Rpb24obm9kZXMpIHtcbiAgICAgICAgICAgIC8vIEVuc3VyZSBpdCdzIGEgcmVhbCBhcnJheSwgYXMgd2UncmUgYWJvdXQgdG8gcmVwYXJlbnQgdGhlIG5vZGVzIGFuZFxuICAgICAgICAgICAgLy8gd2UgZG9uJ3Qgd2FudCB0aGUgdW5kZXJseWluZyBjb2xsZWN0aW9uIHRvIGNoYW5nZSB3aGlsZSB3ZSdyZSBkb2luZyB0aGF0LlxuICAgICAgICAgICAgdmFyIG5vZGVzQXJyYXkgPSBrby51dGlscy5tYWtlQXJyYXkobm9kZXMpO1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlRG9jdW1lbnQgPSAobm9kZXNBcnJheVswXSAmJiBub2Rlc0FycmF5WzBdLm93bmVyRG9jdW1lbnQpIHx8IGRvY3VtZW50O1xuXG4gICAgICAgICAgICB2YXIgY29udGFpbmVyID0gdGVtcGxhdGVEb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gbm9kZXNBcnJheS5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoa28uY2xlYW5Ob2RlKG5vZGVzQXJyYXlbaV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xvbmVOb2RlczogZnVuY3Rpb24gKG5vZGVzQXJyYXksIHNob3VsZENsZWFuTm9kZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gbm9kZXNBcnJheS5sZW5ndGgsIG5ld05vZGVzQXJyYXkgPSBbXTsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBjbG9uZWROb2RlID0gbm9kZXNBcnJheVtpXS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgbmV3Tm9kZXNBcnJheS5wdXNoKHNob3VsZENsZWFuTm9kZXMgPyBrby5jbGVhbk5vZGUoY2xvbmVkTm9kZSkgOiBjbG9uZWROb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXdOb2Rlc0FycmF5O1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldERvbU5vZGVDaGlsZHJlbjogZnVuY3Rpb24gKGRvbU5vZGUsIGNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmVtcHR5RG9tTm9kZShkb21Ob2RlKTtcbiAgICAgICAgICAgIGlmIChjaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBjaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChjaGlsZE5vZGVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZXBsYWNlRG9tTm9kZXM6IGZ1bmN0aW9uIChub2RlVG9SZXBsYWNlT3JOb2RlQXJyYXksIG5ld05vZGVzQXJyYXkpIHtcbiAgICAgICAgICAgIHZhciBub2Rlc1RvUmVwbGFjZUFycmF5ID0gbm9kZVRvUmVwbGFjZU9yTm9kZUFycmF5Lm5vZGVUeXBlID8gW25vZGVUb1JlcGxhY2VPck5vZGVBcnJheV0gOiBub2RlVG9SZXBsYWNlT3JOb2RlQXJyYXk7XG4gICAgICAgICAgICBpZiAobm9kZXNUb1JlcGxhY2VBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluc2VydGlvblBvaW50ID0gbm9kZXNUb1JlcGxhY2VBcnJheVswXTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50ID0gaW5zZXJ0aW9uUG9pbnQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IG5ld05vZGVzQXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5ld05vZGVzQXJyYXlbaV0sIGluc2VydGlvblBvaW50KTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IG5vZGVzVG9SZXBsYWNlQXJyYXkubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLnJlbW92ZU5vZGUobm9kZXNUb1JlcGxhY2VBcnJheVtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGZpeFVwQ29udGludW91c05vZGVBcnJheTogZnVuY3Rpb24oY29udGludW91c05vZGVBcnJheSwgcGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgLy8gQmVmb3JlIGFjdGluZyBvbiBhIHNldCBvZiBub2RlcyB0aGF0IHdlcmUgcHJldmlvdXNseSBvdXRwdXR0ZWQgYnkgYSB0ZW1wbGF0ZSBmdW5jdGlvbiwgd2UgaGF2ZSB0byByZWNvbmNpbGVcbiAgICAgICAgICAgIC8vIHRoZW0gYWdhaW5zdCB3aGF0IGlzIGluIHRoZSBET00gcmlnaHQgbm93LiBJdCBtYXkgYmUgdGhhdCBzb21lIG9mIHRoZSBub2RlcyBoYXZlIGFscmVhZHkgYmVlbiByZW1vdmVkLCBvciB0aGF0XG4gICAgICAgICAgICAvLyBuZXcgbm9kZXMgbWlnaHQgaGF2ZSBiZWVuIGluc2VydGVkIGluIHRoZSBtaWRkbGUsIGZvciBleGFtcGxlIGJ5IGEgYmluZGluZy4gQWxzbywgdGhlcmUgbWF5IHByZXZpb3VzbHkgaGF2ZSBiZWVuXG4gICAgICAgICAgICAvLyBsZWFkaW5nIGNvbW1lbnQgbm9kZXMgKGNyZWF0ZWQgYnkgcmV3cml0dGVuIHN0cmluZy1iYXNlZCB0ZW1wbGF0ZXMpIHRoYXQgaGF2ZSBzaW5jZSBiZWVuIHJlbW92ZWQgZHVyaW5nIGJpbmRpbmcuXG4gICAgICAgICAgICAvLyBTbywgdGhpcyBmdW5jdGlvbiB0cmFuc2xhdGVzIHRoZSBvbGQgXCJtYXBcIiBvdXRwdXQgYXJyYXkgaW50byBpdHMgYmVzdCBndWVzcyBvZiB0aGUgc2V0IG9mIGN1cnJlbnQgRE9NIG5vZGVzLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIFJ1bGVzOlxuICAgICAgICAgICAgLy8gICBbQV0gQW55IGxlYWRpbmcgbm9kZXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlZCBzaG91bGQgYmUgaWdub3JlZFxuICAgICAgICAgICAgLy8gICAgICAgVGhlc2UgbW9zdCBsaWtlbHkgY29ycmVzcG9uZCB0byBtZW1vaXphdGlvbiBub2RlcyB0aGF0IHdlcmUgYWxyZWFkeSByZW1vdmVkIGR1cmluZyBiaW5kaW5nXG4gICAgICAgICAgICAvLyAgICAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L3B1bGwvNDQwXG4gICAgICAgICAgICAvLyAgIFtCXSBBbnkgdHJhaWxpbmcgbm9kZXMgdGhhdCBoYXZlIGJlZW4gcmVtb3ZlIHNob3VsZCBiZSBpZ25vcmVkXG4gICAgICAgICAgICAvLyAgICAgICBUaGlzIHByZXZlbnRzIHRoZSBjb2RlIGhlcmUgZnJvbSBhZGRpbmcgdW5yZWxhdGVkIG5vZGVzIHRvIHRoZSBhcnJheSB3aGlsZSBwcm9jZXNzaW5nIHJ1bGUgW0NdXG4gICAgICAgICAgICAvLyAgICAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L2tub2Nrb3V0L3B1bGwvMTkwM1xuICAgICAgICAgICAgLy8gICBbQ10gV2Ugd2FudCB0byBvdXRwdXQgYSBjb250aW51b3VzIHNlcmllcyBvZiBub2Rlcy4gU28sIGlnbm9yZSBhbnkgbm9kZXMgdGhhdCBoYXZlIGFscmVhZHkgYmVlbiByZW1vdmVkLFxuICAgICAgICAgICAgLy8gICAgICAgYW5kIGluY2x1ZGUgYW55IG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGluc2VydGVkIGFtb25nIHRoZSBwcmV2aW91cyBjb2xsZWN0aW9uXG5cbiAgICAgICAgICAgIGlmIChjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBwYXJlbnQgbm9kZSBjYW4gYmUgYSB2aXJ0dWFsIGVsZW1lbnQ7IHNvIGdldCB0aGUgcmVhbCBwYXJlbnQgbm9kZVxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSAocGFyZW50Tm9kZS5ub2RlVHlwZSA9PT0gOCAmJiBwYXJlbnROb2RlLnBhcmVudE5vZGUpIHx8IHBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgICAgICAvLyBSdWxlIFtBXVxuICAgICAgICAgICAgICAgIHdoaWxlIChjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aCAmJiBjb250aW51b3VzTm9kZUFycmF5WzBdLnBhcmVudE5vZGUgIT09IHBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkuc3BsaWNlKDAsIDEpO1xuXG4gICAgICAgICAgICAgICAgLy8gUnVsZSBbQl1cbiAgICAgICAgICAgICAgICB3aGlsZSAoY29udGludW91c05vZGVBcnJheS5sZW5ndGggPiAxICYmIGNvbnRpbnVvdXNOb2RlQXJyYXlbY29udGludW91c05vZGVBcnJheS5sZW5ndGggLSAxXS5wYXJlbnROb2RlICE9PSBwYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aC0tO1xuXG4gICAgICAgICAgICAgICAgLy8gUnVsZSBbQ11cbiAgICAgICAgICAgICAgICBpZiAoY29udGludW91c05vZGVBcnJheS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gY29udGludW91c05vZGVBcnJheVswXSwgbGFzdCA9IGNvbnRpbnVvdXNOb2RlQXJyYXlbY29udGludW91c05vZGVBcnJheS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVwbGFjZSB3aXRoIHRoZSBhY3R1YWwgbmV3IGNvbnRpbnVvdXMgbm9kZSBzZXRcbiAgICAgICAgICAgICAgICAgICAgY29udGludW91c05vZGVBcnJheS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoY3VycmVudCAhPT0gbGFzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludW91c05vZGVBcnJheS5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29udGludW91c05vZGVBcnJheS5wdXNoKGxhc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb250aW51b3VzTm9kZUFycmF5O1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldE9wdGlvbk5vZGVTZWxlY3Rpb25TdGF0ZTogZnVuY3Rpb24gKG9wdGlvbk5vZGUsIGlzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIC8vIElFNiBzb21ldGltZXMgdGhyb3dzIFwidW5rbm93biBlcnJvclwiIGlmIHlvdSB0cnkgdG8gd3JpdGUgdG8gLnNlbGVjdGVkIGRpcmVjdGx5LCB3aGVyZWFzIEZpcmVmb3ggc3RydWdnbGVzIHdpdGggc2V0QXR0cmlidXRlLiBQaWNrIG9uZSBiYXNlZCBvbiBicm93c2VyLlxuICAgICAgICAgICAgaWYgKGllVmVyc2lvbiA8IDcpXG4gICAgICAgICAgICAgICAgb3B0aW9uTm9kZS5zZXRBdHRyaWJ1dGUoXCJzZWxlY3RlZFwiLCBpc1NlbGVjdGVkKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBvcHRpb25Ob2RlLnNlbGVjdGVkID0gaXNTZWxlY3RlZDtcbiAgICAgICAgfSxcblxuICAgICAgICBzdHJpbmdUcmltOiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5nID09PSBudWxsIHx8IHN0cmluZyA9PT0gdW5kZWZpbmVkID8gJycgOlxuICAgICAgICAgICAgICAgIHN0cmluZy50cmltID9cbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nLnRyaW0oKSA6XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZy50b1N0cmluZygpLnJlcGxhY2UoL15bXFxzXFx4YTBdK3xbXFxzXFx4YTBdKyQvZywgJycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN0cmluZ1N0YXJ0c1dpdGg6IGZ1bmN0aW9uIChzdHJpbmcsIHN0YXJ0c1dpdGgpIHtcbiAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZyB8fCBcIlwiO1xuICAgICAgICAgICAgaWYgKHN0YXJ0c1dpdGgubGVuZ3RoID4gc3RyaW5nLmxlbmd0aClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZygwLCBzdGFydHNXaXRoLmxlbmd0aCkgPT09IHN0YXJ0c1dpdGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZG9tTm9kZUlzQ29udGFpbmVkQnk6IGZ1bmN0aW9uIChub2RlLCBjb250YWluZWRCeU5vZGUpIHtcbiAgICAgICAgICAgIGlmIChub2RlID09PSBjb250YWluZWRCeU5vZGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMTEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBGaXhlcyBpc3N1ZSAjMTE2MiAtIGNhbid0IHVzZSBub2RlLmNvbnRhaW5zIGZvciBkb2N1bWVudCBmcmFnbWVudHMgb24gSUU4XG4gICAgICAgICAgICBpZiAoY29udGFpbmVkQnlOb2RlLmNvbnRhaW5zKVxuICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZWRCeU5vZGUuY29udGFpbnMobm9kZS5ub2RlVHlwZSA9PT0gMyA/IG5vZGUucGFyZW50Tm9kZSA6IG5vZGUpO1xuICAgICAgICAgICAgaWYgKGNvbnRhaW5lZEJ5Tm9kZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbilcbiAgICAgICAgICAgICAgICByZXR1cm4gKGNvbnRhaW5lZEJ5Tm9kZS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihub2RlKSAmIDE2KSA9PSAxNjtcbiAgICAgICAgICAgIHdoaWxlIChub2RlICYmIG5vZGUgIT0gY29udGFpbmVkQnlOb2RlKSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAhIW5vZGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZG9tTm9kZUlzQXR0YWNoZWRUb0RvY3VtZW50OiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmRvbU5vZGVJc0NvbnRhaW5lZEJ5KG5vZGUsIG5vZGUub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFueURvbU5vZGVJc0F0dGFjaGVkVG9Eb2N1bWVudDogZnVuY3Rpb24obm9kZXMpIHtcbiAgICAgICAgICAgIHJldHVybiAhIWtvLnV0aWxzLmFycmF5Rmlyc3Qobm9kZXMsIGtvLnV0aWxzLmRvbU5vZGVJc0F0dGFjaGVkVG9Eb2N1bWVudCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdGFnTmFtZUxvd2VyOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBGb3IgSFRNTCBlbGVtZW50cywgdGFnTmFtZSB3aWxsIGFsd2F5cyBiZSB1cHBlciBjYXNlOyBmb3IgWEhUTUwgZWxlbWVudHMsIGl0J2xsIGJlIGxvd2VyIGNhc2UuXG4gICAgICAgICAgICAvLyBQb3NzaWJsZSBmdXR1cmUgb3B0aW1pemF0aW9uOiBJZiB3ZSBrbm93IGl0J3MgYW4gZWxlbWVudCBmcm9tIGFuIFhIVE1MIGRvY3VtZW50IChub3QgSFRNTCksXG4gICAgICAgICAgICAvLyB3ZSBkb24ndCBuZWVkIHRvIGRvIHRoZSAudG9Mb3dlckNhc2UoKSBhcyBpdCB3aWxsIGFsd2F5cyBiZSBsb3dlciBjYXNlIGFueXdheS5cbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50ICYmIGVsZW1lbnQudGFnTmFtZSAmJiBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYXRjaEZ1bmN0aW9uRXJyb3JzOiBmdW5jdGlvbiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBrb1snb25FcnJvciddID8gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAga29bJ29uRXJyb3InXSAmJiBrb1snb25FcnJvciddKGUpO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gOiBkZWxlZ2F0ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRUaW1lb3V0OiBmdW5jdGlvbiAoaGFuZGxlciwgdGltZW91dCkge1xuICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoa28udXRpbHMuY2F0Y2hGdW5jdGlvbkVycm9ycyhoYW5kbGVyKSwgdGltZW91dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVmZXJFcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBrb1snb25FcnJvciddICYmIGtvWydvbkVycm9yJ10oZXJyb3IpO1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVnaXN0ZXJFdmVudEhhbmRsZXI6IGZ1bmN0aW9uIChlbGVtZW50LCBldmVudFR5cGUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIHZhciB3cmFwcGVkSGFuZGxlciA9IGtvLnV0aWxzLmNhdGNoRnVuY3Rpb25FcnJvcnMoaGFuZGxlcik7XG5cbiAgICAgICAgICAgIHZhciBtdXN0VXNlQXR0YWNoRXZlbnQgPSBpZVZlcnNpb24gJiYgZXZlbnRzVGhhdE11c3RCZVJlZ2lzdGVyZWRVc2luZ0F0dGFjaEV2ZW50W2V2ZW50VHlwZV07XG4gICAgICAgICAgICBpZiAoIWtvLm9wdGlvbnNbJ3VzZU9ubHlOYXRpdmVFdmVudHMnXSAmJiAhbXVzdFVzZUF0dGFjaEV2ZW50ICYmIGpRdWVyeUluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2UoZWxlbWVudClbJ2JpbmQnXShldmVudFR5cGUsIHdyYXBwZWRIYW5kbGVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIW11c3RVc2VBdHRhY2hFdmVudCAmJiB0eXBlb2YgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyID09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCB3cmFwcGVkSGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQuYXR0YWNoRXZlbnQgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHZhciBhdHRhY2hFdmVudEhhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHsgd3JhcHBlZEhhbmRsZXIuY2FsbChlbGVtZW50LCBldmVudCk7IH0sXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaEV2ZW50TmFtZSA9IFwib25cIiArIGV2ZW50VHlwZTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmF0dGFjaEV2ZW50KGF0dGFjaEV2ZW50TmFtZSwgYXR0YWNoRXZlbnRIYW5kbGVyKTtcblxuICAgICAgICAgICAgICAgIC8vIElFIGRvZXMgbm90IGRpc3Bvc2UgYXR0YWNoRXZlbnQgaGFuZGxlcnMgYXV0b21hdGljYWxseSAodW5saWtlIHdpdGggYWRkRXZlbnRMaXN0ZW5lcilcbiAgICAgICAgICAgICAgICAvLyBzbyB0byBhdm9pZCBsZWFrcywgd2UgaGF2ZSB0byByZW1vdmUgdGhlbSBtYW51YWxseS4gU2VlIGJ1ZyAjODU2XG4gICAgICAgICAgICAgICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5kZXRhY2hFdmVudChhdHRhY2hFdmVudE5hbWUsIGF0dGFjaEV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCcm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBhZGRFdmVudExpc3RlbmVyIG9yIGF0dGFjaEV2ZW50XCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRyaWdnZXJFdmVudDogZnVuY3Rpb24gKGVsZW1lbnQsIGV2ZW50VHlwZSkge1xuICAgICAgICAgICAgaWYgKCEoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJlbGVtZW50IG11c3QgYmUgYSBET00gbm9kZSB3aGVuIGNhbGxpbmcgdHJpZ2dlckV2ZW50XCIpO1xuXG4gICAgICAgICAgICAvLyBGb3IgY2xpY2sgZXZlbnRzIG9uIGNoZWNrYm94ZXMgYW5kIHJhZGlvIGJ1dHRvbnMsIGpRdWVyeSB0b2dnbGVzIHRoZSBlbGVtZW50IGNoZWNrZWQgc3RhdGUgKmFmdGVyKiB0aGVcbiAgICAgICAgICAgIC8vIGV2ZW50IGhhbmRsZXIgcnVucyBpbnN0ZWFkIG9mICpiZWZvcmUqLiAoVGhpcyB3YXMgZml4ZWQgaW4gMS45IGZvciBjaGVja2JveGVzIGJ1dCBub3QgZm9yIHJhZGlvIGJ1dHRvbnMuKVxuICAgICAgICAgICAgLy8gSUUgZG9lc24ndCBjaGFuZ2UgdGhlIGNoZWNrZWQgc3RhdGUgd2hlbiB5b3UgdHJpZ2dlciB0aGUgY2xpY2sgZXZlbnQgdXNpbmcgXCJmaXJlRXZlbnRcIi5cbiAgICAgICAgICAgIC8vIEluIGJvdGggY2FzZXMsIHdlJ2xsIHVzZSB0aGUgY2xpY2sgbWV0aG9kIGluc3RlYWQuXG4gICAgICAgICAgICB2YXIgdXNlQ2xpY2tXb3JrYXJvdW5kID0gaXNDbGlja09uQ2hlY2thYmxlRWxlbWVudChlbGVtZW50LCBldmVudFR5cGUpO1xuXG4gICAgICAgICAgICBpZiAoIWtvLm9wdGlvbnNbJ3VzZU9ubHlOYXRpdmVFdmVudHMnXSAmJiBqUXVlcnlJbnN0YW5jZSAmJiAhdXNlQ2xpY2tXb3JrYXJvdW5kKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2UoZWxlbWVudClbJ3RyaWdnZXInXShldmVudFR5cGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50LmRpc3BhdGNoRXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBldmVudENhdGVnb3J5ID0ga25vd25FdmVudFR5cGVzQnlFdmVudE5hbWVbZXZlbnRUeXBlXSB8fCBcIkhUTUxFdmVudHNcIjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoZXZlbnRDYXRlZ29yeSk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LmluaXRFdmVudChldmVudFR5cGUsIHRydWUsIHRydWUsIHdpbmRvdywgMCwgMCwgMCwgMCwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDAsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdXBwbGllZCBlbGVtZW50IGRvZXNuJ3Qgc3VwcG9ydCBkaXNwYXRjaEV2ZW50XCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1c2VDbGlja1dvcmthcm91bmQgJiYgZWxlbWVudC5jbGljaykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xpY2soKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQuZmlyZUV2ZW50ICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmZpcmVFdmVudChcIm9uXCIgKyBldmVudFR5cGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCcm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCB0cmlnZ2VyaW5nIGV2ZW50c1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB1bndyYXBPYnNlcnZhYmxlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrby5pc09ic2VydmFibGUodmFsdWUpID8gdmFsdWUoKSA6IHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBlZWtPYnNlcnZhYmxlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrby5pc09ic2VydmFibGUodmFsdWUpID8gdmFsdWUucGVlaygpIDogdmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9nZ2xlRG9tTm9kZUNzc0NsYXNzOiB0b2dnbGVEb21Ob2RlQ3NzQ2xhc3MsXG5cbiAgICAgICAgc2V0VGV4dENvbnRlbnQ6IGZ1bmN0aW9uKGVsZW1lbnQsIHRleHRDb250ZW50KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHRleHRDb250ZW50KTtcbiAgICAgICAgICAgIGlmICgodmFsdWUgPT09IG51bGwpIHx8ICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSlcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG5cbiAgICAgICAgICAgIC8vIFdlIG5lZWQgdGhlcmUgdG8gYmUgZXhhY3RseSBvbmUgY2hpbGQ6IGEgdGV4dCBub2RlLlxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIGNoaWxkcmVuLCBtb3JlIHRoYW4gb25lLCBvciBpZiBpdCdzIG5vdCBhIHRleHQgbm9kZSxcbiAgICAgICAgICAgIC8vIHdlJ2xsIGNsZWFyIGV2ZXJ5dGhpbmcgYW5kIGNyZWF0ZSBhIHNpbmdsZSB0ZXh0IG5vZGUuXG4gICAgICAgICAgICB2YXIgaW5uZXJUZXh0Tm9kZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5maXJzdENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKCFpbm5lclRleHROb2RlIHx8IGlubmVyVGV4dE5vZGUubm9kZVR5cGUgIT0gMyB8fCBrby52aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcoaW5uZXJUZXh0Tm9kZSkpIHtcbiAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuc2V0RG9tTm9kZUNoaWxkcmVuKGVsZW1lbnQsIFtlbGVtZW50Lm93bmVyRG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmFsdWUpXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlubmVyVGV4dE5vZGUuZGF0YSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBrby51dGlscy5mb3JjZVJlZnJlc2goZWxlbWVudCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0RWxlbWVudE5hbWU6IGZ1bmN0aW9uKGVsZW1lbnQsIG5hbWUpIHtcbiAgICAgICAgICAgIGVsZW1lbnQubmFtZSA9IG5hbWU7XG5cbiAgICAgICAgICAgIC8vIFdvcmthcm91bmQgSUUgNi83IGlzc3VlXG4gICAgICAgICAgICAvLyAtIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvMTk3XG4gICAgICAgICAgICAvLyAtIGh0dHA6Ly93d3cubWF0dHM0MTEuY29tL3Bvc3Qvc2V0dGluZ190aGVfbmFtZV9hdHRyaWJ1dGVfaW5faWVfZG9tL1xuICAgICAgICAgICAgaWYgKGllVmVyc2lvbiA8PSA3KSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5tZXJnZUF0dHJpYnV0ZXMoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIjxpbnB1dCBuYW1lPSdcIiArIGVsZW1lbnQubmFtZSArIFwiJy8+XCIpLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpIHt9IC8vIEZvciBJRTkgd2l0aCBkb2MgbW9kZSBcIklFOSBTdGFuZGFyZHNcIiBhbmQgYnJvd3NlciBtb2RlIFwiSUU5IENvbXBhdGliaWxpdHkgVmlld1wiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9yY2VSZWZyZXNoOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBhbiBJRTkgcmVuZGVyaW5nIGJ1ZyAtIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvMjA5XG4gICAgICAgICAgICBpZiAoaWVWZXJzaW9uID49IDkpIHtcbiAgICAgICAgICAgICAgICAvLyBGb3IgdGV4dCBub2RlcyBhbmQgY29tbWVudCBub2RlcyAobW9zdCBsaWtlbHkgdmlydHVhbCBlbGVtZW50cyksIHdlIHdpbGwgaGF2ZSB0byByZWZyZXNoIHRoZSBjb250YWluZXJcbiAgICAgICAgICAgICAgICB2YXIgZWxlbSA9IG5vZGUubm9kZVR5cGUgPT0gMSA/IG5vZGUgOiBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW0uc3R5bGUpXG4gICAgICAgICAgICAgICAgICAgIGVsZW0uc3R5bGUuem9vbSA9IGVsZW0uc3R5bGUuem9vbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBlbnN1cmVTZWxlY3RFbGVtZW50SXNSZW5kZXJlZENvcnJlY3RseTogZnVuY3Rpb24oc2VsZWN0RWxlbWVudCkge1xuICAgICAgICAgICAgLy8gV29ya2Fyb3VuZCBmb3IgSUU5IHJlbmRlcmluZyBidWcgLSBpdCBkb2Vzbid0IHJlbGlhYmx5IGRpc3BsYXkgYWxsIHRoZSB0ZXh0IGluIGR5bmFtaWNhbGx5LWFkZGVkIHNlbGVjdCBib3hlcyB1bmxlc3MgeW91IGZvcmNlIGl0IHRvIHJlLXJlbmRlciBieSB1cGRhdGluZyB0aGUgd2lkdGguXG4gICAgICAgICAgICAvLyAoU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9pc3N1ZXMvMzEyLCBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU5MDg0OTQvc2VsZWN0LW9ubHktc2hvd3MtZmlyc3QtY2hhci1vZi1zZWxlY3RlZC1vcHRpb24pXG4gICAgICAgICAgICAvLyBBbHNvIGZpeGVzIElFNyBhbmQgSUU4IGJ1ZyB0aGF0IGNhdXNlcyBzZWxlY3RzIHRvIGJlIHplcm8gd2lkdGggaWYgZW5jbG9zZWQgYnkgJ2lmJyBvciAnd2l0aCcuIChTZWUgaXNzdWUgIzgzOSlcbiAgICAgICAgICAgIGlmIChpZVZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxXaWR0aCA9IHNlbGVjdEVsZW1lbnQuc3R5bGUud2lkdGg7XG4gICAgICAgICAgICAgICAgc2VsZWN0RWxlbWVudC5zdHlsZS53aWR0aCA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZWN0RWxlbWVudC5zdHlsZS53aWR0aCA9IG9yaWdpbmFsV2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmFuZ2U6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgICAgICAgICAgbWluID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShtaW4pO1xuICAgICAgICAgICAgbWF4ID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShtYXgpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IG1pbjsgaSA8PSBtYXg7IGkrKylcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWFrZUFycmF5OiBmdW5jdGlvbihhcnJheUxpa2VPYmplY3QpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gYXJyYXlMaWtlT2JqZWN0Lmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGFycmF5TGlrZU9iamVjdFtpXSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICBjcmVhdGVTeW1ib2xPclN0cmluZzogZnVuY3Rpb24oaWRlbnRpZmllcikge1xuICAgICAgICAgICAgcmV0dXJuIGNhblVzZVN5bWJvbHMgPyBTeW1ib2woaWRlbnRpZmllcikgOiBpZGVudGlmaWVyO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzSWU2IDogaXNJZTYsXG4gICAgICAgIGlzSWU3IDogaXNJZTcsXG4gICAgICAgIGllVmVyc2lvbiA6IGllVmVyc2lvbixcblxuICAgICAgICBnZXRGb3JtRmllbGRzOiBmdW5jdGlvbihmb3JtLCBmaWVsZE5hbWUpIHtcbiAgICAgICAgICAgIHZhciBmaWVsZHMgPSBrby51dGlscy5tYWtlQXJyYXkoZm9ybS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpKS5jb25jYXQoa28udXRpbHMubWFrZUFycmF5KGZvcm0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZXh0YXJlYVwiKSkpO1xuICAgICAgICAgICAgdmFyIGlzTWF0Y2hpbmdGaWVsZCA9ICh0eXBlb2YgZmllbGROYW1lID09ICdzdHJpbmcnKVxuICAgICAgICAgICAgICAgID8gZnVuY3Rpb24oZmllbGQpIHsgcmV0dXJuIGZpZWxkLm5hbWUgPT09IGZpZWxkTmFtZSB9XG4gICAgICAgICAgICAgICAgOiBmdW5jdGlvbihmaWVsZCkgeyByZXR1cm4gZmllbGROYW1lLnRlc3QoZmllbGQubmFtZSkgfTsgLy8gVHJlYXQgZmllbGROYW1lIGFzIHJlZ2V4IG9yIG9iamVjdCBjb250YWluaW5nIHByZWRpY2F0ZVxuICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBmaWVsZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNNYXRjaGluZ0ZpZWxkKGZpZWxkc1tpXSkpXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMucHVzaChmaWVsZHNbaV0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlSnNvbjogZnVuY3Rpb24gKGpzb25TdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YganNvblN0cmluZyA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAganNvblN0cmluZyA9IGtvLnV0aWxzLnN0cmluZ1RyaW0oanNvblN0cmluZyk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb25TdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEpTT04gJiYgSlNPTi5wYXJzZSkgLy8gVXNlIG5hdGl2ZSBwYXJzaW5nIHdoZXJlIGF2YWlsYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoanNvblN0cmluZyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAobmV3IEZ1bmN0aW9uKFwicmV0dXJuIFwiICsganNvblN0cmluZykpKCk7IC8vIEZhbGxiYWNrIG9uIGxlc3Mgc2FmZSBwYXJzaW5nIGZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN0cmluZ2lmeUpzb246IGZ1bmN0aW9uIChkYXRhLCByZXBsYWNlciwgc3BhY2UpIHsgICAvLyByZXBsYWNlciBhbmQgc3BhY2UgYXJlIG9wdGlvbmFsXG4gICAgICAgICAgICBpZiAoIUpTT04gfHwgIUpTT04uc3RyaW5naWZ5KVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIEpTT04uc3RyaW5naWZ5KCkuIFNvbWUgYnJvd3NlcnMgKGUuZy4sIElFIDwgOCkgZG9uJ3Qgc3VwcG9ydCBpdCBuYXRpdmVseSwgYnV0IHlvdSBjYW4gb3ZlcmNvbWUgdGhpcyBieSBhZGRpbmcgYSBzY3JpcHQgcmVmZXJlbmNlIHRvIGpzb24yLmpzLCBkb3dubG9hZGFibGUgZnJvbSBodHRwOi8vd3d3Lmpzb24ub3JnL2pzb24yLmpzXCIpO1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoZGF0YSksIHJlcGxhY2VyLCBzcGFjZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcG9zdEpzb246IGZ1bmN0aW9uICh1cmxPckZvcm0sIGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IG9wdGlvbnNbJ3BhcmFtcyddIHx8IHt9O1xuICAgICAgICAgICAgdmFyIGluY2x1ZGVGaWVsZHMgPSBvcHRpb25zWydpbmNsdWRlRmllbGRzJ10gfHwgdGhpcy5maWVsZHNJbmNsdWRlZFdpdGhKc29uUG9zdDtcbiAgICAgICAgICAgIHZhciB1cmwgPSB1cmxPckZvcm07XG5cbiAgICAgICAgICAgIC8vIElmIHdlIHdlcmUgZ2l2ZW4gYSBmb3JtLCB1c2UgaXRzICdhY3Rpb24nIFVSTCBhbmQgcGljayBvdXQgYW55IHJlcXVlc3RlZCBmaWVsZCB2YWx1ZXNcbiAgICAgICAgICAgIGlmKCh0eXBlb2YgdXJsT3JGb3JtID09ICdvYmplY3QnKSAmJiAoa28udXRpbHMudGFnTmFtZUxvd2VyKHVybE9yRm9ybSkgPT09IFwiZm9ybVwiKSkge1xuICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbEZvcm0gPSB1cmxPckZvcm07XG4gICAgICAgICAgICAgICAgdXJsID0gb3JpZ2luYWxGb3JtLmFjdGlvbjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gaW5jbHVkZUZpZWxkcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGRzID0ga28udXRpbHMuZ2V0Rm9ybUZpZWxkcyhvcmlnaW5hbEZvcm0sIGluY2x1ZGVGaWVsZHNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gZmllbGRzLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zW2ZpZWxkc1tqXS5uYW1lXSA9IGZpZWxkc1tqXS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGEgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGRhdGEpO1xuICAgICAgICAgICAgdmFyIGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcbiAgICAgICAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgZm9ybS5hY3Rpb24gPSB1cmw7XG4gICAgICAgICAgICBmb3JtLm1ldGhvZCA9IFwicG9zdFwiO1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBTaW5jZSAnZGF0YScgdGhpcyBpcyBhIG1vZGVsIG9iamVjdCwgd2UgaW5jbHVkZSBhbGwgcHJvcGVydGllcyBpbmNsdWRpbmcgdGhvc2UgaW5oZXJpdGVkIGZyb20gaXRzIHByb3RvdHlwZVxuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgICAgICAgICBpbnB1dC50eXBlID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICBpbnB1dC5uYW1lID0ga2V5O1xuICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0ga28udXRpbHMuc3RyaW5naWZ5SnNvbihrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGRhdGFba2V5XSkpO1xuICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JqZWN0Rm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgICAgICAgICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgaW5wdXQubmFtZSA9IGtleTtcbiAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvcm0pO1xuICAgICAgICAgICAgb3B0aW9uc1snc3VibWl0dGVyJ10gPyBvcHRpb25zWydzdWJtaXR0ZXInXShmb3JtKSA6IGZvcm0uc3VibWl0KCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgZm9ybS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZvcm0pOyB9LCAwKTtcbiAgICAgICAgfVxuICAgIH1cbn0oKSk7XG5cbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMnLCBrby51dGlscyk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5Rm9yRWFjaCcsIGtvLnV0aWxzLmFycmF5Rm9yRWFjaCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5Rmlyc3QnLCBrby51dGlscy5hcnJheUZpcnN0KTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYXJyYXlGaWx0ZXInLCBrby51dGlscy5hcnJheUZpbHRlcik7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5R2V0RGlzdGluY3RWYWx1ZXMnLCBrby51dGlscy5hcnJheUdldERpc3RpbmN0VmFsdWVzKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYXJyYXlJbmRleE9mJywga28udXRpbHMuYXJyYXlJbmRleE9mKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuYXJyYXlNYXAnLCBrby51dGlscy5hcnJheU1hcCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5UHVzaEFsbCcsIGtvLnV0aWxzLmFycmF5UHVzaEFsbCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmFycmF5UmVtb3ZlSXRlbScsIGtvLnV0aWxzLmFycmF5UmVtb3ZlSXRlbSk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmV4dGVuZCcsIGtvLnV0aWxzLmV4dGVuZCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmZpZWxkc0luY2x1ZGVkV2l0aEpzb25Qb3N0Jywga28udXRpbHMuZmllbGRzSW5jbHVkZWRXaXRoSnNvblBvc3QpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5nZXRGb3JtRmllbGRzJywga28udXRpbHMuZ2V0Rm9ybUZpZWxkcyk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnBlZWtPYnNlcnZhYmxlJywga28udXRpbHMucGVla09ic2VydmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5wb3N0SnNvbicsIGtvLnV0aWxzLnBvc3RKc29uKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMucGFyc2VKc29uJywga28udXRpbHMucGFyc2VKc29uKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXInLCBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcik7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnN0cmluZ2lmeUpzb24nLCBrby51dGlscy5zdHJpbmdpZnlKc29uKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMucmFuZ2UnLCBrby51dGlscy5yYW5nZSk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnRvZ2dsZURvbU5vZGVDc3NDbGFzcycsIGtvLnV0aWxzLnRvZ2dsZURvbU5vZGVDc3NDbGFzcyk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnRyaWdnZXJFdmVudCcsIGtvLnV0aWxzLnRyaWdnZXJFdmVudCk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLnVud3JhcE9ic2VydmFibGUnLCBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMub2JqZWN0Rm9yRWFjaCcsIGtvLnV0aWxzLm9iamVjdEZvckVhY2gpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5hZGRPclJlbW92ZUl0ZW0nLCBrby51dGlscy5hZGRPclJlbW92ZUl0ZW0pO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5zZXRUZXh0Q29udGVudCcsIGtvLnV0aWxzLnNldFRleHRDb250ZW50KTtcbmtvLmV4cG9ydFN5bWJvbCgndW53cmFwJywga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSk7IC8vIENvbnZlbmllbnQgc2hvcnRoYW5kLCBiZWNhdXNlIHRoaXMgaXMgdXNlZCBzbyBjb21tb25seVxuXG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZVsnYmluZCddKSB7XG4gICAgLy8gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgaXMgYSBzdGFuZGFyZCBwYXJ0IG9mIEVDTUFTY3JpcHQgNXRoIEVkaXRpb24gKERlY2VtYmVyIDIwMDksIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9wdWJsaWNhdGlvbnMvZmlsZXMvRUNNQS1TVC9FQ01BLTI2Mi5wZGYpXG4gICAgLy8gSW4gY2FzZSB0aGUgYnJvd3NlciBkb2Vzbid0IGltcGxlbWVudCBpdCBuYXRpdmVseSwgcHJvdmlkZSBhIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24uIFRoaXMgaW1wbGVtZW50YXRpb24gaXMgYmFzZWQgb24gdGhlIG9uZSBpbiBwcm90b3R5cGUuanNcbiAgICBGdW5jdGlvbi5wcm90b3R5cGVbJ2JpbmQnXSA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsRnVuY3Rpb24gPSB0aGlzO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvbi5hcHBseShvYmplY3QsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHBhcnRpYWxBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBwYXJ0aWFsQXJncy5zbGljZSgwKTtcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvbi5hcHBseShvYmplY3QsIGFyZ3MpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmtvLnV0aWxzLmRvbURhdGEgPSBuZXcgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdW5pcXVlSWQgPSAwO1xuICAgIHZhciBkYXRhU3RvcmVLZXlFeHBhbmRvUHJvcGVydHlOYW1lID0gXCJfX2tvX19cIiArIChuZXcgRGF0ZSkuZ2V0VGltZSgpO1xuICAgIHZhciBkYXRhU3RvcmUgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGdldEFsbChub2RlLCBjcmVhdGVJZk5vdEZvdW5kKSB7XG4gICAgICAgIHZhciBkYXRhU3RvcmVLZXkgPSBub2RlW2RhdGFTdG9yZUtleUV4cGFuZG9Qcm9wZXJ0eU5hbWVdO1xuICAgICAgICB2YXIgaGFzRXhpc3RpbmdEYXRhU3RvcmUgPSBkYXRhU3RvcmVLZXkgJiYgKGRhdGFTdG9yZUtleSAhPT0gXCJudWxsXCIpICYmIGRhdGFTdG9yZVtkYXRhU3RvcmVLZXldO1xuICAgICAgICBpZiAoIWhhc0V4aXN0aW5nRGF0YVN0b3JlKSB7XG4gICAgICAgICAgICBpZiAoIWNyZWF0ZUlmTm90Rm91bmQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGRhdGFTdG9yZUtleSA9IG5vZGVbZGF0YVN0b3JlS2V5RXhwYW5kb1Byb3BlcnR5TmFtZV0gPSBcImtvXCIgKyB1bmlxdWVJZCsrO1xuICAgICAgICAgICAgZGF0YVN0b3JlW2RhdGFTdG9yZUtleV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YVN0b3JlW2RhdGFTdG9yZUtleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAobm9kZSwga2V5KSB7XG4gICAgICAgICAgICB2YXIgYWxsRGF0YUZvck5vZGUgPSBnZXRBbGwobm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIGFsbERhdGFGb3JOb2RlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBhbGxEYXRhRm9yTm9kZVtrZXldO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChub2RlLCBrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBkb24ndCBhY3R1YWxseSBjcmVhdGUgYSBuZXcgZG9tRGF0YSBrZXkgaWYgd2UgYXJlIGFjdHVhbGx5IGRlbGV0aW5nIGEgdmFsdWVcbiAgICAgICAgICAgICAgICBpZiAoZ2V0QWxsKG5vZGUsIGZhbHNlKSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYWxsRGF0YUZvck5vZGUgPSBnZXRBbGwobm9kZSwgdHJ1ZSk7XG4gICAgICAgICAgICBhbGxEYXRhRm9yTm9kZVtrZXldID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGNsZWFyOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgdmFyIGRhdGFTdG9yZUtleSA9IG5vZGVbZGF0YVN0b3JlS2V5RXhwYW5kb1Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICBpZiAoZGF0YVN0b3JlS2V5KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFTdG9yZVtkYXRhU3RvcmVLZXldO1xuICAgICAgICAgICAgICAgIG5vZGVbZGF0YVN0b3JlS2V5RXhwYW5kb1Byb3BlcnR5TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyBFeHBvc2luZyBcImRpZCBjbGVhblwiIGZsYWcgcHVyZWx5IHNvIHNwZWNzIGNhbiBpbmZlciB3aGV0aGVyIHRoaW5ncyBoYXZlIGJlZW4gY2xlYW5lZCB1cCBhcyBpbnRlbmRlZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIG5leHRLZXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAodW5pcXVlSWQrKykgKyBkYXRhU3RvcmVLZXlFeHBhbmRvUHJvcGVydHlOYW1lO1xuICAgICAgICB9XG4gICAgfTtcbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuZG9tRGF0YScsIGtvLnV0aWxzLmRvbURhdGEpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5kb21EYXRhLmNsZWFyJywga28udXRpbHMuZG9tRGF0YS5jbGVhcik7IC8vIEV4cG9ydGluZyBvbmx5IHNvIHNwZWNzIGNhbiBjbGVhciB1cCBhZnRlciB0aGVtc2VsdmVzIGZ1bGx5XG5cbmtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbCA9IG5ldyAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBkb21EYXRhS2V5ID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCk7XG4gICAgdmFyIGNsZWFuYWJsZU5vZGVUeXBlcyA9IHsgMTogdHJ1ZSwgODogdHJ1ZSwgOTogdHJ1ZSB9OyAgICAgICAvLyBFbGVtZW50LCBDb21tZW50LCBEb2N1bWVudFxuICAgIHZhciBjbGVhbmFibGVOb2RlVHlwZXNXaXRoRGVzY2VuZGFudHMgPSB7IDE6IHRydWUsIDk6IHRydWUgfTsgLy8gRWxlbWVudCwgRG9jdW1lbnRcblxuICAgIGZ1bmN0aW9uIGdldERpc3Bvc2VDYWxsYmFja3NDb2xsZWN0aW9uKG5vZGUsIGNyZWF0ZUlmTm90Rm91bmQpIHtcbiAgICAgICAgdmFyIGFsbERpc3Bvc2VDYWxsYmFja3MgPSBrby51dGlscy5kb21EYXRhLmdldChub2RlLCBkb21EYXRhS2V5KTtcbiAgICAgICAgaWYgKChhbGxEaXNwb3NlQ2FsbGJhY2tzID09PSB1bmRlZmluZWQpICYmIGNyZWF0ZUlmTm90Rm91bmQpIHtcbiAgICAgICAgICAgIGFsbERpc3Bvc2VDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KG5vZGUsIGRvbURhdGFLZXksIGFsbERpc3Bvc2VDYWxsYmFja3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbGxEaXNwb3NlQ2FsbGJhY2tzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkZXN0cm95Q2FsbGJhY2tzQ29sbGVjdGlvbihub2RlKSB7XG4gICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KG5vZGUsIGRvbURhdGFLZXksIHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW5TaW5nbGVOb2RlKG5vZGUpIHtcbiAgICAgICAgLy8gUnVuIGFsbCB0aGUgZGlzcG9zZSBjYWxsYmFja3NcbiAgICAgICAgdmFyIGNhbGxiYWNrcyA9IGdldERpc3Bvc2VDYWxsYmFja3NDb2xsZWN0aW9uKG5vZGUsIGZhbHNlKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICAgICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApOyAvLyBDbG9uZSwgYXMgdGhlIGFycmF5IG1heSBiZSBtb2RpZmllZCBkdXJpbmcgaXRlcmF0aW9uICh0eXBpY2FsbHksIGNhbGxiYWNrcyB3aWxsIHJlbW92ZSB0aGVtc2VsdmVzKVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzW2ldKG5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRXJhc2UgdGhlIERPTSBkYXRhXG4gICAgICAgIGtvLnV0aWxzLmRvbURhdGEuY2xlYXIobm9kZSk7XG5cbiAgICAgICAgLy8gUGVyZm9ybSBjbGVhbnVwIG5lZWRlZCBieSBleHRlcm5hbCBsaWJyYXJpZXMgKGN1cnJlbnRseSBvbmx5IGpRdWVyeSwgYnV0IGNhbiBiZSBleHRlbmRlZClcbiAgICAgICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsW1wiY2xlYW5FeHRlcm5hbERhdGFcIl0obm9kZSk7XG5cbiAgICAgICAgLy8gQ2xlYXIgYW55IGltbWVkaWF0ZS1jaGlsZCBjb21tZW50IG5vZGVzLCBhcyB0aGVzZSB3b3VsZG4ndCBoYXZlIGJlZW4gZm91bmQgYnlcbiAgICAgICAgLy8gbm9kZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikgaW4gY2xlYW5Ob2RlKCkgKGNvbW1lbnQgbm9kZXMgYXJlbid0IGVsZW1lbnRzKVxuICAgICAgICBpZiAoY2xlYW5hYmxlTm9kZVR5cGVzV2l0aERlc2NlbmRhbnRzW25vZGUubm9kZVR5cGVdKVxuICAgICAgICAgICAgY2xlYW5JbW1lZGlhdGVDb21tZW50VHlwZUNoaWxkcmVuKG5vZGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFuSW1tZWRpYXRlQ29tbWVudFR5cGVDaGlsZHJlbihub2RlV2l0aENoaWxkcmVuKSB7XG4gICAgICAgIHZhciBjaGlsZCwgbmV4dENoaWxkID0gbm9kZVdpdGhDaGlsZHJlbi5maXJzdENoaWxkO1xuICAgICAgICB3aGlsZSAoY2hpbGQgPSBuZXh0Q2hpbGQpIHtcbiAgICAgICAgICAgIG5leHRDaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSA4KVxuICAgICAgICAgICAgICAgIGNsZWFuU2luZ2xlTm9kZShjaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhZGREaXNwb3NlQ2FsbGJhY2sgOiBmdW5jdGlvbihub2RlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICAgICAgZ2V0RGlzcG9zZUNhbGxiYWNrc0NvbGxlY3Rpb24obm9kZSwgdHJ1ZSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVtb3ZlRGlzcG9zZUNhbGxiYWNrIDogZnVuY3Rpb24obm9kZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBjYWxsYmFja3NDb2xsZWN0aW9uID0gZ2V0RGlzcG9zZUNhbGxiYWNrc0NvbGxlY3Rpb24obm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrc0NvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheVJlbW92ZUl0ZW0oY2FsbGJhY2tzQ29sbGVjdGlvbiwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja3NDb2xsZWN0aW9uLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAgICAgICAgICBkZXN0cm95Q2FsbGJhY2tzQ29sbGVjdGlvbihub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhbk5vZGUgOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAvLyBGaXJzdCBjbGVhbiB0aGlzIG5vZGUsIHdoZXJlIGFwcGxpY2FibGVcbiAgICAgICAgICAgIGlmIChjbGVhbmFibGVOb2RlVHlwZXNbbm9kZS5ub2RlVHlwZV0pIHtcbiAgICAgICAgICAgICAgICBjbGVhblNpbmdsZU5vZGUobm9kZSk7XG5cbiAgICAgICAgICAgICAgICAvLyAuLi4gdGhlbiBpdHMgZGVzY2VuZGFudHMsIHdoZXJlIGFwcGxpY2FibGVcbiAgICAgICAgICAgICAgICBpZiAoY2xlYW5hYmxlTm9kZVR5cGVzV2l0aERlc2NlbmRhbnRzW25vZGUubm9kZVR5cGVdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENsb25lIHRoZSBkZXNjZW5kYW50cyBsaXN0IGluIGNhc2UgaXQgY2hhbmdlcyBkdXJpbmcgaXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZXNjZW5kYW50cyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheVB1c2hBbGwoZGVzY2VuZGFudHMsIG5vZGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBkZXNjZW5kYW50cy5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhblNpbmdsZU5vZGUoZGVzY2VuZGFudHNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbW92ZU5vZGUgOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBrby5jbGVhbk5vZGUobm9kZSk7XG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBcImNsZWFuRXh0ZXJuYWxEYXRhXCIgOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBzdXBwb3J0IGZvciBqUXVlcnkgaGVyZSBiZWNhdXNlIGl0J3Mgc28gY29tbW9ubHkgdXNlZC5cbiAgICAgICAgICAgIC8vIE1hbnkgalF1ZXJ5IHBsdWdpbnMgKGluY2x1ZGluZyBqcXVlcnkudG1wbCkgc3RvcmUgZGF0YSB1c2luZyBqUXVlcnkncyBlcXVpdmFsZW50IG9mIGRvbURhdGFcbiAgICAgICAgICAgIC8vIHNvIG5vdGlmeSBpdCB0byB0ZWFyIGRvd24gYW55IHJlc291cmNlcyBhc3NvY2lhdGVkIHdpdGggdGhlIG5vZGUgJiBkZXNjZW5kYW50cyBoZXJlLlxuICAgICAgICAgICAgaWYgKGpRdWVyeUluc3RhbmNlICYmICh0eXBlb2YgalF1ZXJ5SW5zdGFuY2VbJ2NsZWFuRGF0YSddID09IFwiZnVuY3Rpb25cIikpXG4gICAgICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2VbJ2NsZWFuRGF0YSddKFtub2RlXSk7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcbmtvLmNsZWFuTm9kZSA9IGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5jbGVhbk5vZGU7IC8vIFNob3J0aGFuZCBuYW1lIGZvciBjb252ZW5pZW5jZVxua28ucmVtb3ZlTm9kZSA9IGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5yZW1vdmVOb2RlOyAvLyBTaG9ydGhhbmQgbmFtZSBmb3IgY29udmVuaWVuY2VcbmtvLmV4cG9ydFN5bWJvbCgnY2xlYW5Ob2RlJywga28uY2xlYW5Ob2RlKTtcbmtvLmV4cG9ydFN5bWJvbCgncmVtb3ZlTm9kZScsIGtvLnJlbW92ZU5vZGUpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5kb21Ob2RlRGlzcG9zYWwnLCBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwpO1xua28uZXhwb3J0U3ltYm9sKCd1dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrJywga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayk7XG5rby5leHBvcnRTeW1ib2woJ3V0aWxzLmRvbU5vZGVEaXNwb3NhbC5yZW1vdmVEaXNwb3NlQ2FsbGJhY2snLCBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwucmVtb3ZlRGlzcG9zZUNhbGxiYWNrKTtcbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5vbmUgPSBbMCwgXCJcIiwgXCJcIl0sXG4gICAgICAgIHRhYmxlID0gWzEsIFwiPHRhYmxlPlwiLCBcIjwvdGFibGU+XCJdLFxuICAgICAgICB0Ym9keSA9IFsyLCBcIjx0YWJsZT48dGJvZHk+XCIsIFwiPC90Ym9keT48L3RhYmxlPlwiXSxcbiAgICAgICAgdHIgPSBbMywgXCI8dGFibGU+PHRib2R5Pjx0cj5cIiwgXCI8L3RyPjwvdGJvZHk+PC90YWJsZT5cIl0sXG4gICAgICAgIHNlbGVjdCA9IFsxLCBcIjxzZWxlY3QgbXVsdGlwbGU9J211bHRpcGxlJz5cIiwgXCI8L3NlbGVjdD5cIl0sXG4gICAgICAgIGxvb2t1cCA9IHtcbiAgICAgICAgICAgICd0aGVhZCc6IHRhYmxlLFxuICAgICAgICAgICAgJ3Rib2R5JzogdGFibGUsXG4gICAgICAgICAgICAndGZvb3QnOiB0YWJsZSxcbiAgICAgICAgICAgICd0cic6IHRib2R5LFxuICAgICAgICAgICAgJ3RkJzogdHIsXG4gICAgICAgICAgICAndGgnOiB0cixcbiAgICAgICAgICAgICdvcHRpb24nOiBzZWxlY3QsXG4gICAgICAgICAgICAnb3B0Z3JvdXAnOiBzZWxlY3RcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUaGlzIGlzIG5lZWRlZCBmb3Igb2xkIElFIGlmIHlvdSdyZSAqbm90KiB1c2luZyBlaXRoZXIgalF1ZXJ5IG9yIGlubmVyU2hpdi4gRG9lc24ndCBhZmZlY3Qgb3RoZXIgY2FzZXMuXG4gICAgICAgIG1heVJlcXVpcmVDcmVhdGVFbGVtZW50SGFjayA9IGtvLnV0aWxzLmllVmVyc2lvbiA8PSA4O1xuXG4gICAgZnVuY3Rpb24gZ2V0V3JhcCh0YWdzKSB7XG4gICAgICAgIHZhciBtID0gdGFncy5tYXRjaCgvXjwoW2Etel0rKVsgPl0vKTtcbiAgICAgICAgcmV0dXJuIChtICYmIGxvb2t1cFttWzFdXSkgfHwgbm9uZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaW1wbGVIdG1sUGFyc2UoaHRtbCwgZG9jdW1lbnRDb250ZXh0KSB7XG4gICAgICAgIGRvY3VtZW50Q29udGV4dCB8fCAoZG9jdW1lbnRDb250ZXh0ID0gZG9jdW1lbnQpO1xuICAgICAgICB2YXIgd2luZG93Q29udGV4dCA9IGRvY3VtZW50Q29udGV4dFsncGFyZW50V2luZG93J10gfHwgZG9jdW1lbnRDb250ZXh0WydkZWZhdWx0VmlldyddIHx8IHdpbmRvdztcblxuICAgICAgICAvLyBCYXNlZCBvbiBqUXVlcnkncyBcImNsZWFuXCIgZnVuY3Rpb24sIGJ1dCBvbmx5IGFjY291bnRpbmcgZm9yIHRhYmxlLXJlbGF0ZWQgZWxlbWVudHMuXG4gICAgICAgIC8vIElmIHlvdSBoYXZlIHJlZmVyZW5jZWQgalF1ZXJ5LCB0aGlzIHdvbid0IGJlIHVzZWQgYW55d2F5IC0gS08gd2lsbCB1c2UgalF1ZXJ5J3MgXCJjbGVhblwiIGZ1bmN0aW9uIGRpcmVjdGx5XG5cbiAgICAgICAgLy8gTm90ZSB0aGF0IHRoZXJlJ3Mgc3RpbGwgYW4gaXNzdWUgaW4gSUUgPCA5IHdoZXJlYnkgaXQgd2lsbCBkaXNjYXJkIGNvbW1lbnQgbm9kZXMgdGhhdCBhcmUgdGhlIGZpcnN0IGNoaWxkIG9mXG4gICAgICAgIC8vIGEgZGVzY2VuZGFudCBub2RlLiBGb3IgZXhhbXBsZTogXCI8ZGl2PjwhLS0gbXljb21tZW50IC0tPmFiYzwvZGl2PlwiIHdpbGwgZ2V0IHBhcnNlZCBhcyBcIjxkaXY+YWJjPC9kaXY+XCJcbiAgICAgICAgLy8gVGhpcyB3b24ndCBhZmZlY3QgYW55b25lIHdobyBoYXMgcmVmZXJlbmNlZCBqUXVlcnksIGFuZCB0aGVyZSdzIGFsd2F5cyB0aGUgd29ya2Fyb3VuZCBvZiBpbnNlcnRpbmcgYSBkdW1teSBub2RlXG4gICAgICAgIC8vIChwb3NzaWJseSBhIHRleHQgbm9kZSkgaW4gZnJvbnQgb2YgdGhlIGNvbW1lbnQuIFNvLCBLTyBkb2VzIG5vdCBhdHRlbXB0IHRvIHdvcmthcm91bmQgdGhpcyBJRSBpc3N1ZSBhdXRvbWF0aWNhbGx5IGF0IHByZXNlbnQuXG5cbiAgICAgICAgLy8gVHJpbSB3aGl0ZXNwYWNlLCBvdGhlcndpc2UgaW5kZXhPZiB3b24ndCB3b3JrIGFzIGV4cGVjdGVkXG4gICAgICAgIHZhciB0YWdzID0ga28udXRpbHMuc3RyaW5nVHJpbShodG1sKS50b0xvd2VyQ2FzZSgpLCBkaXYgPSBkb2N1bWVudENvbnRleHQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgICAgICAgIHdyYXAgPSBnZXRXcmFwKHRhZ3MpLFxuICAgICAgICAgICAgZGVwdGggPSB3cmFwWzBdO1xuXG4gICAgICAgIC8vIEdvIHRvIGh0bWwgYW5kIGJhY2ssIHRoZW4gcGVlbCBvZmYgZXh0cmEgd3JhcHBlcnNcbiAgICAgICAgLy8gTm90ZSB0aGF0IHdlIGFsd2F5cyBwcmVmaXggd2l0aCBzb21lIGR1bW15IHRleHQsIGJlY2F1c2Ugb3RoZXJ3aXNlLCBJRTw5IHdpbGwgc3RyaXAgb3V0IGxlYWRpbmcgY29tbWVudCBub2RlcyBpbiBkZXNjZW5kYW50cy4gVG90YWwgbWFkbmVzcy5cbiAgICAgICAgdmFyIG1hcmt1cCA9IFwiaWdub3JlZDxkaXY+XCIgKyB3cmFwWzFdICsgaHRtbCArIHdyYXBbMl0gKyBcIjwvZGl2PlwiO1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvd0NvbnRleHRbJ2lubmVyU2hpdiddID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgLy8gTm90ZSB0aGF0IGlubmVyU2hpdiBpcyBkZXByZWNhdGVkIGluIGZhdm91ciBvZiBodG1sNXNoaXYuIFdlIHNob3VsZCBjb25zaWRlciBhZGRpbmdcbiAgICAgICAgICAgIC8vIHN1cHBvcnQgZm9yIGh0bWw1c2hpdiAoZXhjZXB0IGlmIG5vIGV4cGxpY2l0IHN1cHBvcnQgaXMgbmVlZGVkLCBlLmcuLCBpZiBodG1sNXNoaXZcbiAgICAgICAgICAgIC8vIHNvbWVob3cgc2hpbXMgdGhlIG5hdGl2ZSBBUElzIHNvIGl0IGp1c3Qgd29ya3MgYW55d2F5KVxuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHdpbmRvd0NvbnRleHRbJ2lubmVyU2hpdiddKG1hcmt1cCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG1heVJlcXVpcmVDcmVhdGVFbGVtZW50SGFjaykge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdteS1lbGVtZW50JykgdHJpY2sgdG8gZW5hYmxlIGN1c3RvbSBlbGVtZW50cyBpbiBJRTYtOFxuICAgICAgICAgICAgICAgIC8vIG9ubHkgd29ya3MgaWYgd2UgYXNzaWduIGlubmVySFRNTCBvbiBhbiBlbGVtZW50IGFzc29jaWF0ZWQgd2l0aCB0aGF0IGRvY3VtZW50LlxuICAgICAgICAgICAgICAgIGRvY3VtZW50Q29udGV4dC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gbWFya3VwO1xuXG4gICAgICAgICAgICBpZiAobWF5UmVxdWlyZUNyZWF0ZUVsZW1lbnRIYWNrKSB7XG4gICAgICAgICAgICAgICAgZGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZGl2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1vdmUgdG8gdGhlIHJpZ2h0IGRlcHRoXG4gICAgICAgIHdoaWxlIChkZXB0aC0tKVxuICAgICAgICAgICAgZGl2ID0gZGl2Lmxhc3RDaGlsZDtcblxuICAgICAgICByZXR1cm4ga28udXRpbHMubWFrZUFycmF5KGRpdi5sYXN0Q2hpbGQuY2hpbGROb2Rlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24galF1ZXJ5SHRtbFBhcnNlKGh0bWwsIGRvY3VtZW50Q29udGV4dCkge1xuICAgICAgICAvLyBqUXVlcnkncyBcInBhcnNlSFRNTFwiIGZ1bmN0aW9uIHdhcyBpbnRyb2R1Y2VkIGluIGpRdWVyeSAxLjguMCBhbmQgaXMgYSBkb2N1bWVudGVkIHB1YmxpYyBBUEkuXG4gICAgICAgIGlmIChqUXVlcnlJbnN0YW5jZVsncGFyc2VIVE1MJ10pIHtcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnlJbnN0YW5jZVsncGFyc2VIVE1MJ10oaHRtbCwgZG9jdW1lbnRDb250ZXh0KSB8fCBbXTsgLy8gRW5zdXJlIHdlIGFsd2F5cyByZXR1cm4gYW4gYXJyYXkgYW5kIG5ldmVyIG51bGxcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEZvciBqUXVlcnkgPCAxLjguMCwgd2UgZmFsbCBiYWNrIG9uIHRoZSB1bmRvY3VtZW50ZWQgaW50ZXJuYWwgXCJjbGVhblwiIGZ1bmN0aW9uLlxuICAgICAgICAgICAgdmFyIGVsZW1zID0galF1ZXJ5SW5zdGFuY2VbJ2NsZWFuJ10oW2h0bWxdLCBkb2N1bWVudENvbnRleHQpO1xuXG4gICAgICAgICAgICAvLyBBcyBvZiBqUXVlcnkgMS43LjEsIGpRdWVyeSBwYXJzZXMgdGhlIEhUTUwgYnkgYXBwZW5kaW5nIGl0IHRvIHNvbWUgZHVtbXkgcGFyZW50IG5vZGVzIGhlbGQgaW4gYW4gaW4tbWVtb3J5IGRvY3VtZW50IGZyYWdtZW50LlxuICAgICAgICAgICAgLy8gVW5mb3J0dW5hdGVseSwgaXQgbmV2ZXIgY2xlYXJzIHRoZSBkdW1teSBwYXJlbnQgbm9kZXMgZnJvbSB0aGUgZG9jdW1lbnQgZnJhZ21lbnQsIHNvIGl0IGxlYWtzIG1lbW9yeSBvdmVyIHRpbWUuXG4gICAgICAgICAgICAvLyBGaXggdGhpcyBieSBmaW5kaW5nIHRoZSB0b3AtbW9zdCBkdW1teSBwYXJlbnQgZWxlbWVudCwgYW5kIGRldGFjaGluZyBpdCBmcm9tIGl0cyBvd25lciBmcmFnbWVudC5cbiAgICAgICAgICAgIGlmIChlbGVtcyAmJiBlbGVtc1swXSkge1xuICAgICAgICAgICAgICAgIC8vIEZpbmQgdGhlIHRvcC1tb3N0IHBhcmVudCBlbGVtZW50IHRoYXQncyBhIGRpcmVjdCBjaGlsZCBvZiBhIGRvY3VtZW50IGZyYWdtZW50XG4gICAgICAgICAgICAgICAgdmFyIGVsZW0gPSBlbGVtc1swXTtcbiAgICAgICAgICAgICAgICB3aGlsZSAoZWxlbS5wYXJlbnROb2RlICYmIGVsZW0ucGFyZW50Tm9kZS5ub2RlVHlwZSAhPT0gMTEgLyogaS5lLiwgRG9jdW1lbnRGcmFnbWVudCAqLylcbiAgICAgICAgICAgICAgICAgICAgZWxlbSA9IGVsZW0ucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICAvLyAuLi4gdGhlbiBkZXRhY2ggaXRcbiAgICAgICAgICAgICAgICBpZiAoZWxlbS5wYXJlbnROb2RlKVxuICAgICAgICAgICAgICAgICAgICBlbGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBlbGVtcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50ID0gZnVuY3Rpb24oaHRtbCwgZG9jdW1lbnRDb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBqUXVlcnlJbnN0YW5jZSA/XG4gICAgICAgICAgICBqUXVlcnlIdG1sUGFyc2UoaHRtbCwgZG9jdW1lbnRDb250ZXh0KSA6ICAgLy8gQXMgYmVsb3csIGJlbmVmaXQgZnJvbSBqUXVlcnkncyBvcHRpbWlzYXRpb25zIHdoZXJlIHBvc3NpYmxlXG4gICAgICAgICAgICBzaW1wbGVIdG1sUGFyc2UoaHRtbCwgZG9jdW1lbnRDb250ZXh0KTsgIC8vIC4uLiBvdGhlcndpc2UsIHRoaXMgc2ltcGxlIGxvZ2ljIHdpbGwgZG8gaW4gbW9zdCBjb21tb24gY2FzZXMuXG4gICAgfTtcblxuICAgIGtvLnV0aWxzLnNldEh0bWwgPSBmdW5jdGlvbihub2RlLCBodG1sKSB7XG4gICAgICAgIGtvLnV0aWxzLmVtcHR5RG9tTm9kZShub2RlKTtcblxuICAgICAgICAvLyBUaGVyZSdzIG5vIGxlZ2l0aW1hdGUgcmVhc29uIHRvIGRpc3BsYXkgYSBzdHJpbmdpZmllZCBvYnNlcnZhYmxlIHdpdGhvdXQgdW53cmFwcGluZyBpdCwgc28gd2UnbGwgdW53cmFwIGl0XG4gICAgICAgIGh0bWwgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGh0bWwpO1xuXG4gICAgICAgIGlmICgoaHRtbCAhPT0gbnVsbCkgJiYgKGh0bWwgIT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaHRtbCAhPSAnc3RyaW5nJylcbiAgICAgICAgICAgICAgICBodG1sID0gaHRtbC50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAvLyBqUXVlcnkgY29udGFpbnMgYSBsb3Qgb2Ygc29waGlzdGljYXRlZCBjb2RlIHRvIHBhcnNlIGFyYml0cmFyeSBIVE1MIGZyYWdtZW50cyxcbiAgICAgICAgICAgIC8vIGZvciBleGFtcGxlIDx0cj4gZWxlbWVudHMgd2hpY2ggYXJlIG5vdCBub3JtYWxseSBhbGxvd2VkIHRvIGV4aXN0IG9uIHRoZWlyIG93bi5cbiAgICAgICAgICAgIC8vIElmIHlvdSd2ZSByZWZlcmVuY2VkIGpRdWVyeSB3ZSdsbCB1c2UgdGhhdCByYXRoZXIgdGhhbiBkdXBsaWNhdGluZyBpdHMgY29kZS5cbiAgICAgICAgICAgIGlmIChqUXVlcnlJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGpRdWVyeUluc3RhbmNlKG5vZGUpWydodG1sJ10oaHRtbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIC4uLiBvdGhlcndpc2UsIHVzZSBLTydzIG93biBwYXJzaW5nIGxvZ2ljLlxuICAgICAgICAgICAgICAgIHZhciBwYXJzZWROb2RlcyA9IGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KGh0bWwsIG5vZGUub3duZXJEb2N1bWVudCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJzZWROb2Rlcy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChwYXJzZWROb2Rlc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCd1dGlscy5wYXJzZUh0bWxGcmFnbWVudCcsIGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KTtcbmtvLmV4cG9ydFN5bWJvbCgndXRpbHMuc2V0SHRtbCcsIGtvLnV0aWxzLnNldEh0bWwpO1xuXG5rby5tZW1vaXphdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1lbW9zID0ge307XG5cbiAgICBmdW5jdGlvbiByYW5kb21NYXg4SGV4Q2hhcnMoKSB7XG4gICAgICAgIHJldHVybiAoKCgxICsgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwMDAwMCkgfCAwKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDEpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbUlkKCkge1xuICAgICAgICByZXR1cm4gcmFuZG9tTWF4OEhleENoYXJzKCkgKyByYW5kb21NYXg4SGV4Q2hhcnMoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmluZE1lbW9Ob2Rlcyhyb290Tm9kZSwgYXBwZW5kVG9BcnJheSkge1xuICAgICAgICBpZiAoIXJvb3ROb2RlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAocm9vdE5vZGUubm9kZVR5cGUgPT0gOCkge1xuICAgICAgICAgICAgdmFyIG1lbW9JZCA9IGtvLm1lbW9pemF0aW9uLnBhcnNlTWVtb1RleHQocm9vdE5vZGUubm9kZVZhbHVlKTtcbiAgICAgICAgICAgIGlmIChtZW1vSWQgIT0gbnVsbClcbiAgICAgICAgICAgICAgICBhcHBlbmRUb0FycmF5LnB1c2goeyBkb21Ob2RlOiByb290Tm9kZSwgbWVtb0lkOiBtZW1vSWQgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAocm9vdE5vZGUubm9kZVR5cGUgPT0gMSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGNoaWxkTm9kZXMgPSByb290Tm9kZS5jaGlsZE5vZGVzLCBqID0gY2hpbGROb2Rlcy5sZW5ndGg7IGkgPCBqOyBpKyspXG4gICAgICAgICAgICAgICAgZmluZE1lbW9Ob2RlcyhjaGlsZE5vZGVzW2ldLCBhcHBlbmRUb0FycmF5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIG1lbW9pemU6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IGNhbiBvbmx5IHBhc3MgYSBmdW5jdGlvbiB0byBrby5tZW1vaXphdGlvbi5tZW1vaXplKClcIik7XG4gICAgICAgICAgICB2YXIgbWVtb0lkID0gZ2VuZXJhdGVSYW5kb21JZCgpO1xuICAgICAgICAgICAgbWVtb3NbbWVtb0lkXSA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgcmV0dXJuIFwiPCEtLVtrb19tZW1vOlwiICsgbWVtb0lkICsgXCJdLS0+XCI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5tZW1vaXplOiBmdW5jdGlvbiAobWVtb0lkLCBjYWxsYmFja1BhcmFtcykge1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gbWVtb3NbbWVtb0lkXTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYW55IG1lbW8gd2l0aCBJRCBcIiArIG1lbW9JZCArIFwiLiBQZXJoYXBzIGl0J3MgYWxyZWFkeSBiZWVuIHVubWVtb2l6ZWQuXCIpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBjYWxsYmFja1BhcmFtcyB8fCBbXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgZGVsZXRlIG1lbW9zW21lbW9JZF07IH1cbiAgICAgICAgfSxcblxuICAgICAgICB1bm1lbW9pemVEb21Ob2RlQW5kRGVzY2VuZGFudHM6IGZ1bmN0aW9uIChkb21Ob2RlLCBleHRyYUNhbGxiYWNrUGFyYW1zQXJyYXkpIHtcbiAgICAgICAgICAgIHZhciBtZW1vcyA9IFtdO1xuICAgICAgICAgICAgZmluZE1lbW9Ob2Rlcyhkb21Ob2RlLCBtZW1vcyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IG1lbW9zLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBub2RlID0gbWVtb3NbaV0uZG9tTm9kZTtcbiAgICAgICAgICAgICAgICB2YXIgY29tYmluZWRQYXJhbXMgPSBbbm9kZV07XG4gICAgICAgICAgICAgICAgaWYgKGV4dHJhQ2FsbGJhY2tQYXJhbXNBcnJheSlcbiAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlQdXNoQWxsKGNvbWJpbmVkUGFyYW1zLCBleHRyYUNhbGxiYWNrUGFyYW1zQXJyYXkpO1xuICAgICAgICAgICAgICAgIGtvLm1lbW9pemF0aW9uLnVubWVtb2l6ZShtZW1vc1tpXS5tZW1vSWQsIGNvbWJpbmVkUGFyYW1zKTtcbiAgICAgICAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IFwiXCI7IC8vIE5ldXRlciB0aGlzIG5vZGUgc28gd2UgZG9uJ3QgdHJ5IHRvIHVubWVtb2l6ZSBpdCBhZ2FpblxuICAgICAgICAgICAgICAgIGlmIChub2RlLnBhcmVudE5vZGUpXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTsgLy8gSWYgcG9zc2libGUsIGVyYXNlIGl0IHRvdGFsbHkgKG5vdCBhbHdheXMgcG9zc2libGUgLSBzb21lb25lIGVsc2UgbWlnaHQganVzdCBob2xkIGEgcmVmZXJlbmNlIHRvIGl0IHRoZW4gY2FsbCB1bm1lbW9pemVEb21Ob2RlQW5kRGVzY2VuZGFudHMgYWdhaW4pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VNZW1vVGV4dDogZnVuY3Rpb24gKG1lbW9UZXh0KSB7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBtZW1vVGV4dC5tYXRjaCgvXlxcW2tvX21lbW9cXDooLio/KVxcXSQvKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ21lbW9pemF0aW9uJywga28ubWVtb2l6YXRpb24pO1xua28uZXhwb3J0U3ltYm9sKCdtZW1vaXphdGlvbi5tZW1vaXplJywga28ubWVtb2l6YXRpb24ubWVtb2l6ZSk7XG5rby5leHBvcnRTeW1ib2woJ21lbW9pemF0aW9uLnVubWVtb2l6ZScsIGtvLm1lbW9pemF0aW9uLnVubWVtb2l6ZSk7XG5rby5leHBvcnRTeW1ib2woJ21lbW9pemF0aW9uLnBhcnNlTWVtb1RleHQnLCBrby5tZW1vaXphdGlvbi5wYXJzZU1lbW9UZXh0KTtcbmtvLmV4cG9ydFN5bWJvbCgnbWVtb2l6YXRpb24udW5tZW1vaXplRG9tTm9kZUFuZERlc2NlbmRhbnRzJywga28ubWVtb2l6YXRpb24udW5tZW1vaXplRG9tTm9kZUFuZERlc2NlbmRhbnRzKTtcbmtvLnRhc2tzID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2NoZWR1bGVyLFxuICAgICAgICB0YXNrUXVldWUgPSBbXSxcbiAgICAgICAgdGFza1F1ZXVlTGVuZ3RoID0gMCxcbiAgICAgICAgbmV4dEhhbmRsZSA9IDEsXG4gICAgICAgIG5leHRJbmRleFRvUHJvY2VzcyA9IDA7XG5cbiAgICBpZiAod2luZG93WydNdXRhdGlvbk9ic2VydmVyJ10pIHtcbiAgICAgICAgLy8gQ2hyb21lIDI3KywgRmlyZWZveCAxNCssIElFIDExKywgT3BlcmEgMTUrLCBTYWZhcmkgNi4xK1xuICAgICAgICAvLyBGcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQgKiBDb3B5cmlnaHQgKGMpIDIwMTQgUGV0a2EgQW50b25vdiAqIExpY2Vuc2U6IE1JVFxuICAgICAgICBzY2hlZHVsZXIgPSAoZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIG5ldyBNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKS5vYnNlcnZlKGRpdiwge2F0dHJpYnV0ZXM6IHRydWV9KTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IGRpdi5jbGFzc0xpc3QudG9nZ2xlKFwiZm9vXCIpOyB9O1xuICAgICAgICB9KShzY2hlZHVsZWRQcm9jZXNzKTtcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50ICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkge1xuICAgICAgICAvLyBJRSA2LTEwXG4gICAgICAgIC8vIEZyb20gaHR0cHM6Ly9naXRodWIuY29tL1l1enVKUy9zZXRJbW1lZGlhdGUgKiBDb3B5cmlnaHQgKGMpIDIwMTIgQmFybmVzYW5kbm9ibGUuY29tLCBsbGMsIERvbmF2b24gV2VzdCwgYW5kIERvbWVuaWMgRGVuaWNvbGEgKiBMaWNlbnNlOiBNSVRcbiAgICAgICAgc2NoZWR1bGVyID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNjaGVkdWxlciA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgc2V0VGltZW91dChjYWxsYmFjaywgMCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1Rhc2tzKCkge1xuICAgICAgICBpZiAodGFza1F1ZXVlTGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBFYWNoIG1hcmsgcmVwcmVzZW50cyB0aGUgZW5kIG9mIGEgbG9naWNhbCBncm91cCBvZiB0YXNrcyBhbmQgdGhlIG51bWJlciBvZiB0aGVzZSBncm91cHMgaXNcbiAgICAgICAgICAgIC8vIGxpbWl0ZWQgdG8gcHJldmVudCB1bmNoZWNrZWQgcmVjdXJzaW9uLlxuICAgICAgICAgICAgdmFyIG1hcmsgPSB0YXNrUXVldWVMZW5ndGgsIGNvdW50TWFya3MgPSAwO1xuXG4gICAgICAgICAgICAvLyBuZXh0SW5kZXhUb1Byb2Nlc3Mga2VlcHMgdHJhY2sgb2Ygd2hlcmUgd2UgYXJlIGluIHRoZSBxdWV1ZTsgcHJvY2Vzc1Rhc2tzIGNhbiBiZSBjYWxsZWQgcmVjdXJzaXZlbHkgd2l0aG91dCBpc3N1ZVxuICAgICAgICAgICAgZm9yICh2YXIgdGFzazsgbmV4dEluZGV4VG9Qcm9jZXNzIDwgdGFza1F1ZXVlTGVuZ3RoOyApIHtcbiAgICAgICAgICAgICAgICBpZiAodGFzayA9IHRhc2tRdWV1ZVtuZXh0SW5kZXhUb1Byb2Nlc3MrK10pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbmRleFRvUHJvY2VzcyA+IG1hcmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgrK2NvdW50TWFya3MgPj0gNTAwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRJbmRleFRvUHJvY2VzcyA9IHRhc2tRdWV1ZUxlbmd0aDsgICAvLyBza2lwIGFsbCB0YXNrcyByZW1haW5pbmcgaW4gdGhlIHF1ZXVlIHNpbmNlIGFueSBvZiB0aGVtIGNvdWxkIGJlIGNhdXNpbmcgdGhlIHJlY3Vyc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmRlZmVyRXJyb3IoRXJyb3IoXCInVG9vIG11Y2ggcmVjdXJzaW9uJyBhZnRlciBwcm9jZXNzaW5nIFwiICsgY291bnRNYXJrcyArIFwiIHRhc2sgZ3JvdXBzLlwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrID0gdGFza1F1ZXVlTGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5kZWZlckVycm9yKGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjaGVkdWxlZFByb2Nlc3MoKSB7XG4gICAgICAgIHByb2Nlc3NUYXNrcygpO1xuXG4gICAgICAgIC8vIFJlc2V0IHRoZSBxdWV1ZVxuICAgICAgICBuZXh0SW5kZXhUb1Byb2Nlc3MgPSB0YXNrUXVldWVMZW5ndGggPSB0YXNrUXVldWUubGVuZ3RoID0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2hlZHVsZVRhc2tQcm9jZXNzaW5nKCkge1xuICAgICAgICBrby50YXNrc1snc2NoZWR1bGVyJ10oc2NoZWR1bGVkUHJvY2Vzcyk7XG4gICAgfVxuXG4gICAgdmFyIHRhc2tzID0ge1xuICAgICAgICAnc2NoZWR1bGVyJzogc2NoZWR1bGVyLCAgICAgLy8gQWxsb3cgb3ZlcnJpZGluZyB0aGUgc2NoZWR1bGVyXG5cbiAgICAgICAgc2NoZWR1bGU6IGZ1bmN0aW9uIChmdW5jKSB7XG4gICAgICAgICAgICBpZiAoIXRhc2tRdWV1ZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHNjaGVkdWxlVGFza1Byb2Nlc3NpbmcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFza1F1ZXVlW3Rhc2tRdWV1ZUxlbmd0aCsrXSA9IGZ1bmM7XG4gICAgICAgICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbmNlbDogZnVuY3Rpb24gKGhhbmRsZSkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gaGFuZGxlIC0gKG5leHRIYW5kbGUgLSB0YXNrUXVldWVMZW5ndGgpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID49IG5leHRJbmRleFRvUHJvY2VzcyAmJiBpbmRleCA8IHRhc2tRdWV1ZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRhc2tRdWV1ZVtpbmRleF0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEZvciB0ZXN0aW5nIG9ubHk6IHJlc2V0IHRoZSBxdWV1ZSBhbmQgcmV0dXJuIHRoZSBwcmV2aW91cyBxdWV1ZSBsZW5ndGhcbiAgICAgICAgJ3Jlc2V0Rm9yVGVzdGluZyc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSB0YXNrUXVldWVMZW5ndGggLSBuZXh0SW5kZXhUb1Byb2Nlc3M7XG4gICAgICAgICAgICBuZXh0SW5kZXhUb1Byb2Nlc3MgPSB0YXNrUXVldWVMZW5ndGggPSB0YXNrUXVldWUubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcnVuRWFybHk6IHByb2Nlc3NUYXNrc1xuICAgIH07XG5cbiAgICByZXR1cm4gdGFza3M7XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ3Rhc2tzJywga28udGFza3MpO1xua28uZXhwb3J0U3ltYm9sKCd0YXNrcy5zY2hlZHVsZScsIGtvLnRhc2tzLnNjaGVkdWxlKTtcbi8va28uZXhwb3J0U3ltYm9sKCd0YXNrcy5jYW5jZWwnLCBrby50YXNrcy5jYW5jZWwpOyAgXCJjYW5jZWxcIiBpc24ndCBtaW5pZmllZFxua28uZXhwb3J0U3ltYm9sKCd0YXNrcy5ydW5FYXJseScsIGtvLnRhc2tzLnJ1bkVhcmx5KTtcbmtvLmV4dGVuZGVycyA9IHtcbiAgICAndGhyb3R0bGUnOiBmdW5jdGlvbih0YXJnZXQsIHRpbWVvdXQpIHtcbiAgICAgICAgLy8gVGhyb3R0bGluZyBtZWFucyB0d28gdGhpbmdzOlxuXG4gICAgICAgIC8vICgxKSBGb3IgZGVwZW5kZW50IG9ic2VydmFibGVzLCB3ZSB0aHJvdHRsZSAqZXZhbHVhdGlvbnMqIHNvIHRoYXQsIG5vIG1hdHRlciBob3cgZmFzdCBpdHMgZGVwZW5kZW5jaWVzXG4gICAgICAgIC8vICAgICBub3RpZnkgdXBkYXRlcywgdGhlIHRhcmdldCBkb2Vzbid0IHJlLWV2YWx1YXRlIChhbmQgaGVuY2UgZG9lc24ndCBub3RpZnkpIGZhc3RlciB0aGFuIGEgY2VydGFpbiByYXRlXG4gICAgICAgIHRhcmdldFsndGhyb3R0bGVFdmFsdWF0aW9uJ10gPSB0aW1lb3V0O1xuXG4gICAgICAgIC8vICgyKSBGb3Igd3JpdGFibGUgdGFyZ2V0cyAob2JzZXJ2YWJsZXMsIG9yIHdyaXRhYmxlIGRlcGVuZGVudCBvYnNlcnZhYmxlcyksIHdlIHRocm90dGxlICp3cml0ZXMqXG4gICAgICAgIC8vICAgICBzbyB0aGUgdGFyZ2V0IGNhbm5vdCBjaGFuZ2UgdmFsdWUgc3luY2hyb25vdXNseSBvciBmYXN0ZXIgdGhhbiBhIGNlcnRhaW4gcmF0ZVxuICAgICAgICB2YXIgd3JpdGVUaW1lb3V0SW5zdGFuY2UgPSBudWxsO1xuICAgICAgICByZXR1cm4ga28uZGVwZW5kZW50T2JzZXJ2YWJsZSh7XG4gICAgICAgICAgICAncmVhZCc6IHRhcmdldCxcbiAgICAgICAgICAgICd3cml0ZSc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHdyaXRlVGltZW91dEluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICB3cml0ZVRpbWVvdXRJbnN0YW5jZSA9IGtvLnV0aWxzLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAncmF0ZUxpbWl0JzogZnVuY3Rpb24odGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgICAgIHZhciB0aW1lb3V0LCBtZXRob2QsIGxpbWl0RnVuY3Rpb247XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gb3B0aW9ucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBvcHRpb25zWyd0aW1lb3V0J107XG4gICAgICAgICAgICBtZXRob2QgPSBvcHRpb25zWydtZXRob2QnXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJhdGVMaW1pdCBzdXBlcnNlZGVzIGRlZmVycmVkIHVwZGF0ZXNcbiAgICAgICAgdGFyZ2V0Ll9kZWZlclVwZGF0ZXMgPSBmYWxzZTtcblxuICAgICAgICBsaW1pdEZ1bmN0aW9uID0gbWV0aG9kID09ICdub3RpZnlXaGVuQ2hhbmdlc1N0b3AnID8gIGRlYm91bmNlIDogdGhyb3R0bGU7XG4gICAgICAgIHRhcmdldC5saW1pdChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIGxpbWl0RnVuY3Rpb24oY2FsbGJhY2ssIHRpbWVvdXQpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgJ2RlZmVycmVkJzogZnVuY3Rpb24odGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zICE9PSB0cnVlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcXCdkZWZlcnJlZFxcJyBleHRlbmRlciBvbmx5IGFjY2VwdHMgdGhlIHZhbHVlIFxcJ3RydWVcXCcsIGJlY2F1c2UgaXQgaXMgbm90IHN1cHBvcnRlZCB0byB0dXJuIGRlZmVycmFsIG9mZiBvbmNlIGVuYWJsZWQuJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGFyZ2V0Ll9kZWZlclVwZGF0ZXMpIHtcbiAgICAgICAgICAgIHRhcmdldC5fZGVmZXJVcGRhdGVzID0gdHJ1ZTtcbiAgICAgICAgICAgIHRhcmdldC5saW1pdChmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLnRhc2tzLmNhbmNlbChoYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGUgPSBrby50YXNrcy5zY2hlZHVsZShjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFsnbm90aWZ5U3Vic2NyaWJlcnMnXSh1bmRlZmluZWQsICdkaXJ0eScpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAnbm90aWZ5JzogZnVuY3Rpb24odGFyZ2V0LCBub3RpZnlXaGVuKSB7XG4gICAgICAgIHRhcmdldFtcImVxdWFsaXR5Q29tcGFyZXJcIl0gPSBub3RpZnlXaGVuID09IFwiYWx3YXlzXCIgP1xuICAgICAgICAgICAgbnVsbCA6ICAvLyBudWxsIGVxdWFsaXR5Q29tcGFyZXIgbWVhbnMgdG8gYWx3YXlzIG5vdGlmeVxuICAgICAgICAgICAgdmFsdWVzQXJlUHJpbWl0aXZlQW5kRXF1YWw7XG4gICAgfVxufTtcblxudmFyIHByaW1pdGl2ZVR5cGVzID0geyAndW5kZWZpbmVkJzoxLCAnYm9vbGVhbic6MSwgJ251bWJlcic6MSwgJ3N0cmluZyc6MSB9O1xuZnVuY3Rpb24gdmFsdWVzQXJlUHJpbWl0aXZlQW5kRXF1YWwoYSwgYikge1xuICAgIHZhciBvbGRWYWx1ZUlzUHJpbWl0aXZlID0gKGEgPT09IG51bGwpIHx8ICh0eXBlb2YoYSkgaW4gcHJpbWl0aXZlVHlwZXMpO1xuICAgIHJldHVybiBvbGRWYWx1ZUlzUHJpbWl0aXZlID8gKGEgPT09IGIpIDogZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHRocm90dGxlKGNhbGxiYWNrLCB0aW1lb3V0KSB7XG4gICAgdmFyIHRpbWVvdXRJbnN0YW5jZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRpbWVvdXRJbnN0YW5jZSkge1xuICAgICAgICAgICAgdGltZW91dEluc3RhbmNlID0ga28udXRpbHMuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGltZW91dEluc3RhbmNlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGRlYm91bmNlKGNhbGxiYWNrLCB0aW1lb3V0KSB7XG4gICAgdmFyIHRpbWVvdXRJbnN0YW5jZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEluc3RhbmNlKTtcbiAgICAgICAgdGltZW91dEluc3RhbmNlID0ga28udXRpbHMuc2V0VGltZW91dChjYWxsYmFjaywgdGltZW91dCk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYXBwbHlFeHRlbmRlcnMocmVxdWVzdGVkRXh0ZW5kZXJzKSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXM7XG4gICAgaWYgKHJlcXVlc3RlZEV4dGVuZGVycykge1xuICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKHJlcXVlc3RlZEV4dGVuZGVycywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGV4dGVuZGVySGFuZGxlciA9IGtvLmV4dGVuZGVyc1trZXldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBleHRlbmRlckhhbmRsZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IGV4dGVuZGVySGFuZGxlcih0YXJnZXQsIHZhbHVlKSB8fCB0YXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuXG5rby5leHBvcnRTeW1ib2woJ2V4dGVuZGVycycsIGtvLmV4dGVuZGVycyk7XG5cbmtvLnN1YnNjcmlwdGlvbiA9IGZ1bmN0aW9uICh0YXJnZXQsIGNhbGxiYWNrLCBkaXNwb3NlQ2FsbGJhY2spIHtcbiAgICB0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMuZGlzcG9zZUNhbGxiYWNrID0gZGlzcG9zZUNhbGxiYWNrO1xuICAgIHRoaXMuaXNEaXNwb3NlZCA9IGZhbHNlO1xuICAgIGtvLmV4cG9ydFByb3BlcnR5KHRoaXMsICdkaXNwb3NlJywgdGhpcy5kaXNwb3NlKTtcbn07XG5rby5zdWJzY3JpcHRpb24ucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pc0Rpc3Bvc2VkID0gdHJ1ZTtcbiAgICB0aGlzLmRpc3Bvc2VDYWxsYmFjaygpO1xufTtcblxua28uc3Vic2NyaWJhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mT3JFeHRlbmQodGhpcywga29fc3Vic2NyaWJhYmxlX2ZuKTtcbiAgICBrb19zdWJzY3JpYmFibGVfZm4uaW5pdCh0aGlzKTtcbn1cblxudmFyIGRlZmF1bHRFdmVudCA9IFwiY2hhbmdlXCI7XG5cbi8vIE1vdmVkIG91dCBvZiBcImxpbWl0XCIgdG8gYXZvaWQgdGhlIGV4dHJhIGNsb3N1cmVcbmZ1bmN0aW9uIGxpbWl0Tm90aWZ5U3Vic2NyaWJlcnModmFsdWUsIGV2ZW50KSB7XG4gICAgaWYgKCFldmVudCB8fCBldmVudCA9PT0gZGVmYXVsdEV2ZW50KSB7XG4gICAgICAgIHRoaXMuX2xpbWl0Q2hhbmdlKHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50ID09PSAnYmVmb3JlQ2hhbmdlJykge1xuICAgICAgICB0aGlzLl9saW1pdEJlZm9yZUNoYW5nZSh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fb3JpZ05vdGlmeVN1YnNjcmliZXJzKHZhbHVlLCBldmVudCk7XG4gICAgfVxufVxuXG52YXIga29fc3Vic2NyaWJhYmxlX2ZuID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gICAgICAgIGluc3RhbmNlLl9zdWJzY3JpcHRpb25zID0ge307XG4gICAgICAgIGluc3RhbmNlLl92ZXJzaW9uTnVtYmVyID0gMTtcbiAgICB9LFxuXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIGNhbGxiYWNrVGFyZ2V0LCBldmVudCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgZXZlbnQgPSBldmVudCB8fCBkZWZhdWx0RXZlbnQ7XG4gICAgICAgIHZhciBib3VuZENhbGxiYWNrID0gY2FsbGJhY2tUYXJnZXQgPyBjYWxsYmFjay5iaW5kKGNhbGxiYWNrVGFyZ2V0KSA6IGNhbGxiYWNrO1xuXG4gICAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBuZXcga28uc3Vic2NyaXB0aW9uKHNlbGYsIGJvdW5kQ2FsbGJhY2ssIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5UmVtb3ZlSXRlbShzZWxmLl9zdWJzY3JpcHRpb25zW2V2ZW50XSwgc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmFmdGVyU3Vic2NyaXB0aW9uUmVtb3ZlKVxuICAgICAgICAgICAgICAgIHNlbGYuYWZ0ZXJTdWJzY3JpcHRpb25SZW1vdmUoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoc2VsZi5iZWZvcmVTdWJzY3JpcHRpb25BZGQpXG4gICAgICAgICAgICBzZWxmLmJlZm9yZVN1YnNjcmlwdGlvbkFkZChldmVudCk7XG5cbiAgICAgICAgaWYgKCFzZWxmLl9zdWJzY3JpcHRpb25zW2V2ZW50XSlcbiAgICAgICAgICAgIHNlbGYuX3N1YnNjcmlwdGlvbnNbZXZlbnRdID0gW107XG4gICAgICAgIHNlbGYuX3N1YnNjcmlwdGlvbnNbZXZlbnRdLnB1c2goc3Vic2NyaXB0aW9uKTtcblxuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgIH0sXG5cbiAgICBcIm5vdGlmeVN1YnNjcmliZXJzXCI6IGZ1bmN0aW9uICh2YWx1ZVRvTm90aWZ5LCBldmVudCkge1xuICAgICAgICBldmVudCA9IGV2ZW50IHx8IGRlZmF1bHRFdmVudDtcbiAgICAgICAgaWYgKGV2ZW50ID09PSBkZWZhdWx0RXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmVyc2lvbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmhhc1N1YnNjcmlwdGlvbnNGb3JFdmVudChldmVudCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5iZWdpbigpOyAvLyBCZWdpbiBzdXBwcmVzc2luZyBkZXBlbmRlbmN5IGRldGVjdGlvbiAoYnkgc2V0dGluZyB0aGUgdG9wIGZyYW1lIHRvIHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhID0gdGhpcy5fc3Vic2NyaXB0aW9uc1tldmVudF0uc2xpY2UoMCksIGkgPSAwLCBzdWJzY3JpcHRpb247IHN1YnNjcmlwdGlvbiA9IGFbaV07ICsraSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbiBjYXNlIGEgc3Vic2NyaXB0aW9uIHdhcyBkaXNwb3NlZCBkdXJpbmcgdGhlIGFycmF5Rm9yRWFjaCBjeWNsZSwgY2hlY2tcbiAgICAgICAgICAgICAgICAgICAgLy8gZm9yIGlzRGlzcG9zZWQgb24gZWFjaCBzdWJzY3JpcHRpb24gYmVmb3JlIGludm9raW5nIGl0cyBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXN1YnNjcmlwdGlvbi5pc0Rpc3Bvc2VkKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLmNhbGxiYWNrKHZhbHVlVG9Ob3RpZnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5lbmQoKTsgLy8gRW5kIHN1cHByZXNzaW5nIGRlcGVuZGVuY3kgZGV0ZWN0aW9uXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0VmVyc2lvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmVyc2lvbk51bWJlcjtcbiAgICB9LFxuXG4gICAgaGFzQ2hhbmdlZDogZnVuY3Rpb24gKHZlcnNpb25Ub0NoZWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFZlcnNpb24oKSAhPT0gdmVyc2lvblRvQ2hlY2s7XG4gICAgfSxcblxuICAgIHVwZGF0ZVZlcnNpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgKyt0aGlzLl92ZXJzaW9uTnVtYmVyO1xuICAgIH0sXG5cbiAgICBsaW1pdDogZnVuY3Rpb24obGltaXRGdW5jdGlvbikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXMsIHNlbGZJc09ic2VydmFibGUgPSBrby5pc09ic2VydmFibGUoc2VsZiksXG4gICAgICAgICAgICBpZ25vcmVCZWZvcmVDaGFuZ2UsIHByZXZpb3VzVmFsdWUsIHBlbmRpbmdWYWx1ZSwgYmVmb3JlQ2hhbmdlID0gJ2JlZm9yZUNoYW5nZSc7XG5cbiAgICAgICAgaWYgKCFzZWxmLl9vcmlnTm90aWZ5U3Vic2NyaWJlcnMpIHtcbiAgICAgICAgICAgIHNlbGYuX29yaWdOb3RpZnlTdWJzY3JpYmVycyA9IHNlbGZbXCJub3RpZnlTdWJzY3JpYmVyc1wiXTtcbiAgICAgICAgICAgIHNlbGZbXCJub3RpZnlTdWJzY3JpYmVyc1wiXSA9IGxpbWl0Tm90aWZ5U3Vic2NyaWJlcnM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmluaXNoID0gbGltaXRGdW5jdGlvbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuX25vdGlmaWNhdGlvbklzUGVuZGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBJZiBhbiBvYnNlcnZhYmxlIHByb3ZpZGVkIGEgcmVmZXJlbmNlIHRvIGl0c2VsZiwgYWNjZXNzIGl0IHRvIGdldCB0aGUgbGF0ZXN0IHZhbHVlLlxuICAgICAgICAgICAgLy8gVGhpcyBhbGxvd3MgY29tcHV0ZWQgb2JzZXJ2YWJsZXMgdG8gZGVsYXkgY2FsY3VsYXRpbmcgdGhlaXIgdmFsdWUgdW50aWwgbmVlZGVkLlxuICAgICAgICAgICAgaWYgKHNlbGZJc09ic2VydmFibGUgJiYgcGVuZGluZ1ZhbHVlID09PSBzZWxmKSB7XG4gICAgICAgICAgICAgICAgcGVuZGluZ1ZhbHVlID0gc2VsZigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWdub3JlQmVmb3JlQ2hhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoc2VsZi5pc0RpZmZlcmVudChwcmV2aW91c1ZhbHVlLCBwZW5kaW5nVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fb3JpZ05vdGlmeVN1YnNjcmliZXJzKHByZXZpb3VzVmFsdWUgPSBwZW5kaW5nVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLl9saW1pdENoYW5nZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBzZWxmLl9ub3RpZmljYXRpb25Jc1BlbmRpbmcgPSBpZ25vcmVCZWZvcmVDaGFuZ2UgPSB0cnVlO1xuICAgICAgICAgICAgcGVuZGluZ1ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICBmaW5pc2goKTtcbiAgICAgICAgfTtcbiAgICAgICAgc2VsZi5fbGltaXRCZWZvcmVDaGFuZ2UgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKCFpZ25vcmVCZWZvcmVDaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgc2VsZi5fb3JpZ05vdGlmeVN1YnNjcmliZXJzKHZhbHVlLCBiZWZvcmVDaGFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBoYXNTdWJzY3JpcHRpb25zRm9yRXZlbnQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdWJzY3JpcHRpb25zW2V2ZW50XSAmJiB0aGlzLl9zdWJzY3JpcHRpb25zW2V2ZW50XS5sZW5ndGg7XG4gICAgfSxcblxuICAgIGdldFN1YnNjcmlwdGlvbnNDb3VudDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N1YnNjcmlwdGlvbnNbZXZlbnRdICYmIHRoaXMuX3N1YnNjcmlwdGlvbnNbZXZlbnRdLmxlbmd0aCB8fCAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2godGhpcy5fc3Vic2NyaXB0aW9ucywgZnVuY3Rpb24oZXZlbnROYW1lLCBzdWJzY3JpcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSAhPT0gJ2RpcnR5JylcbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gc3Vic2NyaXB0aW9ucy5sZW5ndGg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0b3RhbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0RpZmZlcmVudDogZnVuY3Rpb24ob2xkVmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIHJldHVybiAhdGhpc1snZXF1YWxpdHlDb21wYXJlciddIHx8ICF0aGlzWydlcXVhbGl0eUNvbXBhcmVyJ10ob2xkVmFsdWUsIG5ld1ZhbHVlKTtcbiAgICB9LFxuXG4gICAgZXh0ZW5kOiBhcHBseUV4dGVuZGVyc1xufTtcblxua28uZXhwb3J0UHJvcGVydHkoa29fc3Vic2NyaWJhYmxlX2ZuLCAnc3Vic2NyaWJlJywga29fc3Vic2NyaWJhYmxlX2ZuLnN1YnNjcmliZSk7XG5rby5leHBvcnRQcm9wZXJ0eShrb19zdWJzY3JpYmFibGVfZm4sICdleHRlbmQnLCBrb19zdWJzY3JpYmFibGVfZm4uZXh0ZW5kKTtcbmtvLmV4cG9ydFByb3BlcnR5KGtvX3N1YnNjcmliYWJsZV9mbiwgJ2dldFN1YnNjcmlwdGlvbnNDb3VudCcsIGtvX3N1YnNjcmliYWJsZV9mbi5nZXRTdWJzY3JpcHRpb25zQ291bnQpO1xuXG4vLyBGb3IgYnJvd3NlcnMgdGhhdCBzdXBwb3J0IHByb3RvIGFzc2lnbm1lbnQsIHdlIG92ZXJ3cml0ZSB0aGUgcHJvdG90eXBlIG9mIGVhY2hcbi8vIG9ic2VydmFibGUgaW5zdGFuY2UuIFNpbmNlIG9ic2VydmFibGVzIGFyZSBmdW5jdGlvbnMsIHdlIG5lZWQgRnVuY3Rpb24ucHJvdG90eXBlXG4vLyB0byBzdGlsbCBiZSBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuaWYgKGtvLnV0aWxzLmNhblNldFByb3RvdHlwZSkge1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mKGtvX3N1YnNjcmliYWJsZV9mbiwgRnVuY3Rpb24ucHJvdG90eXBlKTtcbn1cblxua28uc3Vic2NyaWJhYmxlWydmbiddID0ga29fc3Vic2NyaWJhYmxlX2ZuO1xuXG5cbmtvLmlzU3Vic2NyaWJhYmxlID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlICE9IG51bGwgJiYgdHlwZW9mIGluc3RhbmNlLnN1YnNjcmliZSA9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGluc3RhbmNlW1wibm90aWZ5U3Vic2NyaWJlcnNcIl0gPT0gXCJmdW5jdGlvblwiO1xufTtcblxua28uZXhwb3J0U3ltYm9sKCdzdWJzY3JpYmFibGUnLCBrby5zdWJzY3JpYmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCdpc1N1YnNjcmliYWJsZScsIGtvLmlzU3Vic2NyaWJhYmxlKTtcblxua28uY29tcHV0ZWRDb250ZXh0ID0ga28uZGVwZW5kZW5jeURldGVjdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG91dGVyRnJhbWVzID0gW10sXG4gICAgICAgIGN1cnJlbnRGcmFtZSxcbiAgICAgICAgbGFzdElkID0gMDtcblxuICAgIC8vIFJldHVybiBhIHVuaXF1ZSBJRCB0aGF0IGNhbiBiZSBhc3NpZ25lZCB0byBhbiBvYnNlcnZhYmxlIGZvciBkZXBlbmRlbmN5IHRyYWNraW5nLlxuICAgIC8vIFRoZW9yZXRpY2FsbHksIHlvdSBjb3VsZCBldmVudHVhbGx5IG92ZXJmbG93IHRoZSBudW1iZXIgc3RvcmFnZSBzaXplLCByZXN1bHRpbmdcbiAgICAvLyBpbiBkdXBsaWNhdGUgSURzLiBCdXQgaW4gSmF2YVNjcmlwdCwgdGhlIGxhcmdlc3QgZXhhY3QgaW50ZWdyYWwgdmFsdWUgaXMgMl41M1xuICAgIC8vIG9yIDksMDA3LDE5OSwyNTQsNzQwLDk5Mi4gSWYgeW91IGNyZWF0ZWQgMSwwMDAsMDAwIElEcyBwZXIgc2Vjb25kLCBpdCB3b3VsZFxuICAgIC8vIHRha2Ugb3ZlciAyODUgeWVhcnMgdG8gcmVhY2ggdGhhdCBudW1iZXIuXG4gICAgLy8gUmVmZXJlbmNlIGh0dHA6Ly9ibG9nLnZqZXV4LmNvbS8yMDEwL2phdmFzY3JpcHQvamF2YXNjcmlwdC1tYXhfaW50LW51bWJlci1saW1pdHMuaHRtbFxuICAgIGZ1bmN0aW9uIGdldElkKCkge1xuICAgICAgICByZXR1cm4gKytsYXN0SWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmVnaW4ob3B0aW9ucykge1xuICAgICAgICBvdXRlckZyYW1lcy5wdXNoKGN1cnJlbnRGcmFtZSk7XG4gICAgICAgIGN1cnJlbnRGcmFtZSA9IG9wdGlvbnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kKCkge1xuICAgICAgICBjdXJyZW50RnJhbWUgPSBvdXRlckZyYW1lcy5wb3AoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBiZWdpbjogYmVnaW4sXG5cbiAgICAgICAgZW5kOiBlbmQsXG5cbiAgICAgICAgcmVnaXN0ZXJEZXBlbmRlbmN5OiBmdW5jdGlvbiAoc3Vic2NyaWJhYmxlKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudEZyYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFrby5pc1N1YnNjcmliYWJsZShzdWJzY3JpYmFibGUpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IHN1YnNjcmliYWJsZSB0aGluZ3MgY2FuIGFjdCBhcyBkZXBlbmRlbmNpZXNcIik7XG4gICAgICAgICAgICAgICAgY3VycmVudEZyYW1lLmNhbGxiYWNrLmNhbGwoY3VycmVudEZyYW1lLmNhbGxiYWNrVGFyZ2V0LCBzdWJzY3JpYmFibGUsIHN1YnNjcmliYWJsZS5faWQgfHwgKHN1YnNjcmliYWJsZS5faWQgPSBnZXRJZCgpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaWdub3JlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIGNhbGxiYWNrVGFyZ2V0LCBjYWxsYmFja0FyZ3MpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYmVnaW4oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkoY2FsbGJhY2tUYXJnZXQsIGNhbGxiYWNrQXJncyB8fCBbXSk7XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIGVuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldERlcGVuZGVuY2llc0NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudEZyYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50RnJhbWUuY29tcHV0ZWQuZ2V0RGVwZW5kZW5jaWVzQ291bnQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0luaXRpYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRGcmFtZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudEZyYW1lLmlzSW5pdGlhbDtcbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ2NvbXB1dGVkQ29udGV4dCcsIGtvLmNvbXB1dGVkQ29udGV4dCk7XG5rby5leHBvcnRTeW1ib2woJ2NvbXB1dGVkQ29udGV4dC5nZXREZXBlbmRlbmNpZXNDb3VudCcsIGtvLmNvbXB1dGVkQ29udGV4dC5nZXREZXBlbmRlbmNpZXNDb3VudCk7XG5rby5leHBvcnRTeW1ib2woJ2NvbXB1dGVkQ29udGV4dC5pc0luaXRpYWwnLCBrby5jb21wdXRlZENvbnRleHQuaXNJbml0aWFsKTtcblxua28uZXhwb3J0U3ltYm9sKCdpZ25vcmVEZXBlbmRlbmNpZXMnLCBrby5pZ25vcmVEZXBlbmRlbmNpZXMgPSBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZSk7XG52YXIgb2JzZXJ2YWJsZUxhdGVzdFZhbHVlID0ga28udXRpbHMuY3JlYXRlU3ltYm9sT3JTdHJpbmcoJ19sYXRlc3RWYWx1ZScpO1xuXG5rby5vYnNlcnZhYmxlID0gZnVuY3Rpb24gKGluaXRpYWxWYWx1ZSkge1xuICAgIGZ1bmN0aW9uIG9ic2VydmFibGUoKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gV3JpdGVcblxuICAgICAgICAgICAgLy8gSWdub3JlIHdyaXRlcyBpZiB0aGUgdmFsdWUgaGFzbid0IGNoYW5nZWRcbiAgICAgICAgICAgIGlmIChvYnNlcnZhYmxlLmlzRGlmZmVyZW50KG9ic2VydmFibGVbb2JzZXJ2YWJsZUxhdGVzdFZhbHVlXSwgYXJndW1lbnRzWzBdKSkge1xuICAgICAgICAgICAgICAgIG9ic2VydmFibGUudmFsdWVXaWxsTXV0YXRlKCk7XG4gICAgICAgICAgICAgICAgb2JzZXJ2YWJsZVtvYnNlcnZhYmxlTGF0ZXN0VmFsdWVdID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgIG9ic2VydmFibGUudmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpczsgLy8gUGVybWl0cyBjaGFpbmVkIGFzc2lnbm1lbnRzXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBSZWFkXG4gICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLnJlZ2lzdGVyRGVwZW5kZW5jeShvYnNlcnZhYmxlKTsgLy8gVGhlIGNhbGxlciBvbmx5IG5lZWRzIHRvIGJlIG5vdGlmaWVkIG9mIGNoYW5nZXMgaWYgdGhleSBkaWQgYSBcInJlYWRcIiBvcGVyYXRpb25cbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZhYmxlW29ic2VydmFibGVMYXRlc3RWYWx1ZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvYnNlcnZhYmxlW29ic2VydmFibGVMYXRlc3RWYWx1ZV0gPSBpbml0aWFsVmFsdWU7XG5cbiAgICAvLyBJbmhlcml0IGZyb20gJ3N1YnNjcmliYWJsZSdcbiAgICBpZiAoIWtvLnV0aWxzLmNhblNldFByb3RvdHlwZSkge1xuICAgICAgICAvLyAnc3Vic2NyaWJhYmxlJyB3b24ndCBiZSBvbiB0aGUgcHJvdG90eXBlIGNoYWluIHVubGVzcyB3ZSBwdXQgaXQgdGhlcmUgZGlyZWN0bHlcbiAgICAgICAga28udXRpbHMuZXh0ZW5kKG9ic2VydmFibGUsIGtvLnN1YnNjcmliYWJsZVsnZm4nXSk7XG4gICAgfVxuICAgIGtvLnN1YnNjcmliYWJsZVsnZm4nXS5pbml0KG9ic2VydmFibGUpO1xuXG4gICAgLy8gSW5oZXJpdCBmcm9tICdvYnNlcnZhYmxlJ1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mT3JFeHRlbmQob2JzZXJ2YWJsZSwgb2JzZXJ2YWJsZUZuKTtcblxuICAgIGlmIChrby5vcHRpb25zWydkZWZlclVwZGF0ZXMnXSkge1xuICAgICAgICBrby5leHRlbmRlcnNbJ2RlZmVycmVkJ10ob2JzZXJ2YWJsZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG59XG5cbi8vIERlZmluZSBwcm90b3R5cGUgZm9yIG9ic2VydmFibGVzXG52YXIgb2JzZXJ2YWJsZUZuID0ge1xuICAgICdlcXVhbGl0eUNvbXBhcmVyJzogdmFsdWVzQXJlUHJpbWl0aXZlQW5kRXF1YWwsXG4gICAgcGVlazogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzW29ic2VydmFibGVMYXRlc3RWYWx1ZV07IH0sXG4gICAgdmFsdWVIYXNNdXRhdGVkOiBmdW5jdGlvbiAoKSB7IHRoaXNbJ25vdGlmeVN1YnNjcmliZXJzJ10odGhpc1tvYnNlcnZhYmxlTGF0ZXN0VmFsdWVdKTsgfSxcbiAgICB2YWx1ZVdpbGxNdXRhdGU6IGZ1bmN0aW9uICgpIHsgdGhpc1snbm90aWZ5U3Vic2NyaWJlcnMnXSh0aGlzW29ic2VydmFibGVMYXRlc3RWYWx1ZV0sICdiZWZvcmVDaGFuZ2UnKTsgfVxufTtcblxuLy8gTm90ZSB0aGF0IGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgcHJvdG8gYXNzaWdubWVudCwgdGhlXG4vLyBpbmhlcml0YW5jZSBjaGFpbiBpcyBjcmVhdGVkIG1hbnVhbGx5IGluIHRoZSBrby5vYnNlcnZhYmxlIGNvbnN0cnVjdG9yXG5pZiAoa28udXRpbHMuY2FuU2V0UHJvdG90eXBlKSB7XG4gICAga28udXRpbHMuc2V0UHJvdG90eXBlT2Yob2JzZXJ2YWJsZUZuLCBrby5zdWJzY3JpYmFibGVbJ2ZuJ10pO1xufVxuXG52YXIgcHJvdG9Qcm9wZXJ0eSA9IGtvLm9ic2VydmFibGUucHJvdG9Qcm9wZXJ0eSA9ICdfX2tvX3Byb3RvX18nO1xub2JzZXJ2YWJsZUZuW3Byb3RvUHJvcGVydHldID0ga28ub2JzZXJ2YWJsZTtcblxua28uaGFzUHJvdG90eXBlID0gZnVuY3Rpb24oaW5zdGFuY2UsIHByb3RvdHlwZSkge1xuICAgIGlmICgoaW5zdGFuY2UgPT09IG51bGwpIHx8IChpbnN0YW5jZSA9PT0gdW5kZWZpbmVkKSB8fCAoaW5zdGFuY2VbcHJvdG9Qcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaW5zdGFuY2VbcHJvdG9Qcm9wZXJ0eV0gPT09IHByb3RvdHlwZSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGtvLmhhc1Byb3RvdHlwZShpbnN0YW5jZVtwcm90b1Byb3BlcnR5XSwgcHJvdG90eXBlKTsgLy8gV2FsayB0aGUgcHJvdG90eXBlIGNoYWluXG59O1xuXG5rby5pc09ic2VydmFibGUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4ga28uaGFzUHJvdG90eXBlKGluc3RhbmNlLCBrby5vYnNlcnZhYmxlKTtcbn1cbmtvLmlzV3JpdGVhYmxlT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIC8vIE9ic2VydmFibGVcbiAgICBpZiAoKHR5cGVvZiBpbnN0YW5jZSA9PSAnZnVuY3Rpb24nKSAmJiBpbnN0YW5jZVtwcm90b1Byb3BlcnR5XSA9PT0ga28ub2JzZXJ2YWJsZSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgLy8gV3JpdGVhYmxlIGRlcGVuZGVudCBvYnNlcnZhYmxlXG4gICAgaWYgKCh0eXBlb2YgaW5zdGFuY2UgPT0gJ2Z1bmN0aW9uJykgJiYgKGluc3RhbmNlW3Byb3RvUHJvcGVydHldID09PSBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKSAmJiAoaW5zdGFuY2UuaGFzV3JpdGVGdW5jdGlvbikpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIC8vIEFueXRoaW5nIGVsc2VcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmtvLmV4cG9ydFN5bWJvbCgnb2JzZXJ2YWJsZScsIGtvLm9ic2VydmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCdpc09ic2VydmFibGUnLCBrby5pc09ic2VydmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCdpc1dyaXRlYWJsZU9ic2VydmFibGUnLCBrby5pc1dyaXRlYWJsZU9ic2VydmFibGUpO1xua28uZXhwb3J0U3ltYm9sKCdpc1dyaXRhYmxlT2JzZXJ2YWJsZScsIGtvLmlzV3JpdGVhYmxlT2JzZXJ2YWJsZSk7XG5rby5leHBvcnRTeW1ib2woJ29ic2VydmFibGUuZm4nLCBvYnNlcnZhYmxlRm4pO1xua28uZXhwb3J0UHJvcGVydHkob2JzZXJ2YWJsZUZuLCAncGVlaycsIG9ic2VydmFibGVGbi5wZWVrKTtcbmtvLmV4cG9ydFByb3BlcnR5KG9ic2VydmFibGVGbiwgJ3ZhbHVlSGFzTXV0YXRlZCcsIG9ic2VydmFibGVGbi52YWx1ZUhhc011dGF0ZWQpO1xua28uZXhwb3J0UHJvcGVydHkob2JzZXJ2YWJsZUZuLCAndmFsdWVXaWxsTXV0YXRlJywgb2JzZXJ2YWJsZUZuLnZhbHVlV2lsbE11dGF0ZSk7XG5rby5vYnNlcnZhYmxlQXJyYXkgPSBmdW5jdGlvbiAoaW5pdGlhbFZhbHVlcykge1xuICAgIGluaXRpYWxWYWx1ZXMgPSBpbml0aWFsVmFsdWVzIHx8IFtdO1xuXG4gICAgaWYgKHR5cGVvZiBpbml0aWFsVmFsdWVzICE9ICdvYmplY3QnIHx8ICEoJ2xlbmd0aCcgaW4gaW5pdGlhbFZhbHVlcykpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBhcmd1bWVudCBwYXNzZWQgd2hlbiBpbml0aWFsaXppbmcgYW4gb2JzZXJ2YWJsZSBhcnJheSBtdXN0IGJlIGFuIGFycmF5LCBvciBudWxsLCBvciB1bmRlZmluZWQuXCIpO1xuXG4gICAgdmFyIHJlc3VsdCA9IGtvLm9ic2VydmFibGUoaW5pdGlhbFZhbHVlcyk7XG4gICAga28udXRpbHMuc2V0UHJvdG90eXBlT2ZPckV4dGVuZChyZXN1bHQsIGtvLm9ic2VydmFibGVBcnJheVsnZm4nXSk7XG4gICAgcmV0dXJuIHJlc3VsdC5leHRlbmQoeyd0cmFja0FycmF5Q2hhbmdlcyc6dHJ1ZX0pO1xufTtcblxua28ub2JzZXJ2YWJsZUFycmF5WydmbiddID0ge1xuICAgICdyZW1vdmUnOiBmdW5jdGlvbiAodmFsdWVPclByZWRpY2F0ZSkge1xuICAgICAgICB2YXIgdW5kZXJseWluZ0FycmF5ID0gdGhpcy5wZWVrKCk7XG4gICAgICAgIHZhciByZW1vdmVkVmFsdWVzID0gW107XG4gICAgICAgIHZhciBwcmVkaWNhdGUgPSB0eXBlb2YgdmFsdWVPclByZWRpY2F0ZSA9PSBcImZ1bmN0aW9uXCIgJiYgIWtvLmlzT2JzZXJ2YWJsZSh2YWx1ZU9yUHJlZGljYXRlKSA/IHZhbHVlT3JQcmVkaWNhdGUgOiBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHZhbHVlID09PSB2YWx1ZU9yUHJlZGljYXRlOyB9O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVuZGVybHlpbmdBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdW5kZXJseWluZ0FycmF5W2ldO1xuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVtb3ZlZFZhbHVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZVdpbGxNdXRhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVtb3ZlZFZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB1bmRlcmx5aW5nQXJyYXkuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVtb3ZlZFZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVIYXNNdXRhdGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlbW92ZWRWYWx1ZXM7XG4gICAgfSxcblxuICAgICdyZW1vdmVBbGwnOiBmdW5jdGlvbiAoYXJyYXlPZlZhbHVlcykge1xuICAgICAgICAvLyBJZiB5b3UgcGFzc2VkIHplcm8gYXJncywgd2UgcmVtb3ZlIGV2ZXJ5dGhpbmdcbiAgICAgICAgaWYgKGFycmF5T2ZWYWx1ZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIHVuZGVybHlpbmdBcnJheSA9IHRoaXMucGVlaygpO1xuICAgICAgICAgICAgdmFyIGFsbFZhbHVlcyA9IHVuZGVybHlpbmdBcnJheS5zbGljZSgwKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVXaWxsTXV0YXRlKCk7XG4gICAgICAgICAgICB1bmRlcmx5aW5nQXJyYXkuc3BsaWNlKDAsIHVuZGVybHlpbmdBcnJheS5sZW5ndGgpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgICAgIHJldHVybiBhbGxWYWx1ZXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgeW91IHBhc3NlZCBhbiBhcmcsIHdlIGludGVycHJldCBpdCBhcyBhbiBhcnJheSBvZiBlbnRyaWVzIHRvIHJlbW92ZVxuICAgICAgICBpZiAoIWFycmF5T2ZWYWx1ZXMpXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHJldHVybiB0aGlzWydyZW1vdmUnXShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5hcnJheUluZGV4T2YoYXJyYXlPZlZhbHVlcywgdmFsdWUpID49IDA7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAnZGVzdHJveSc6IGZ1bmN0aW9uICh2YWx1ZU9yUHJlZGljYXRlKSB7XG4gICAgICAgIHZhciB1bmRlcmx5aW5nQXJyYXkgPSB0aGlzLnBlZWsoKTtcbiAgICAgICAgdmFyIHByZWRpY2F0ZSA9IHR5cGVvZiB2YWx1ZU9yUHJlZGljYXRlID09IFwiZnVuY3Rpb25cIiAmJiAha28uaXNPYnNlcnZhYmxlKHZhbHVlT3JQcmVkaWNhdGUpID8gdmFsdWVPclByZWRpY2F0ZSA6IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgPT09IHZhbHVlT3JQcmVkaWNhdGU7IH07XG4gICAgICAgIHRoaXMudmFsdWVXaWxsTXV0YXRlKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSB1bmRlcmx5aW5nQXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHVuZGVybHlpbmdBcnJheVtpXTtcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUpKVxuICAgICAgICAgICAgICAgIHVuZGVybHlpbmdBcnJheVtpXVtcIl9kZXN0cm95XCJdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgIH0sXG5cbiAgICAnZGVzdHJveUFsbCc6IGZ1bmN0aW9uIChhcnJheU9mVmFsdWVzKSB7XG4gICAgICAgIC8vIElmIHlvdSBwYXNzZWQgemVybyBhcmdzLCB3ZSBkZXN0cm95IGV2ZXJ5dGhpbmdcbiAgICAgICAgaWYgKGFycmF5T2ZWYWx1ZXMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzWydkZXN0cm95J10oZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlIH0pO1xuXG4gICAgICAgIC8vIElmIHlvdSBwYXNzZWQgYW4gYXJnLCB3ZSBpbnRlcnByZXQgaXQgYXMgYW4gYXJyYXkgb2YgZW50cmllcyB0byBkZXN0cm95XG4gICAgICAgIGlmICghYXJyYXlPZlZhbHVlcylcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXNbJ2Rlc3Ryb3knXShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5hcnJheUluZGV4T2YoYXJyYXlPZlZhbHVlcywgdmFsdWUpID49IDA7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAnaW5kZXhPZic6IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHZhciB1bmRlcmx5aW5nQXJyYXkgPSB0aGlzKCk7XG4gICAgICAgIHJldHVybiBrby51dGlscy5hcnJheUluZGV4T2YodW5kZXJseWluZ0FycmF5LCBpdGVtKTtcbiAgICB9LFxuXG4gICAgJ3JlcGxhY2UnOiBmdW5jdGlvbihvbGRJdGVtLCBuZXdJdGVtKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXNbJ2luZGV4T2YnXShvbGRJdGVtKTtcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVXaWxsTXV0YXRlKCk7XG4gICAgICAgICAgICB0aGlzLnBlZWsoKVtpbmRleF0gPSBuZXdJdGVtO1xuICAgICAgICAgICAgdGhpcy52YWx1ZUhhc011dGF0ZWQoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vIE5vdGUgdGhhdCBmb3IgYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IHByb3RvIGFzc2lnbm1lbnQsIHRoZVxuLy8gaW5oZXJpdGFuY2UgY2hhaW4gaXMgY3JlYXRlZCBtYW51YWxseSBpbiB0aGUga28ub2JzZXJ2YWJsZUFycmF5IGNvbnN0cnVjdG9yXG5pZiAoa28udXRpbHMuY2FuU2V0UHJvdG90eXBlKSB7XG4gICAga28udXRpbHMuc2V0UHJvdG90eXBlT2Yoa28ub2JzZXJ2YWJsZUFycmF5WydmbiddLCBrby5vYnNlcnZhYmxlWydmbiddKTtcbn1cblxuLy8gUG9wdWxhdGUga28ub2JzZXJ2YWJsZUFycmF5LmZuIHdpdGggcmVhZC93cml0ZSBmdW5jdGlvbnMgZnJvbSBuYXRpdmUgYXJyYXlzXG4vLyBJbXBvcnRhbnQ6IERvIG5vdCBhZGQgYW55IGFkZGl0aW9uYWwgZnVuY3Rpb25zIGhlcmUgdGhhdCBtYXkgcmVhc29uYWJseSBiZSB1c2VkIHRvICpyZWFkKiBkYXRhIGZyb20gdGhlIGFycmF5XG4vLyBiZWNhdXNlIHdlJ2xsIGV2YWwgdGhlbSB3aXRob3V0IGNhdXNpbmcgc3Vic2NyaXB0aW9ucywgc28ga28uY29tcHV0ZWQgb3V0cHV0IGNvdWxkIGVuZCB1cCBnZXR0aW5nIHN0YWxlXG5rby51dGlscy5hcnJheUZvckVhY2goW1wicG9wXCIsIFwicHVzaFwiLCBcInJldmVyc2VcIiwgXCJzaGlmdFwiLCBcInNvcnRcIiwgXCJzcGxpY2VcIiwgXCJ1bnNoaWZ0XCJdLCBmdW5jdGlvbiAobWV0aG9kTmFtZSkge1xuICAgIGtvLm9ic2VydmFibGVBcnJheVsnZm4nXVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gVXNlIFwicGVla1wiIHRvIGF2b2lkIGNyZWF0aW5nIGEgc3Vic2NyaXB0aW9uIGluIGFueSBjb21wdXRlZCB0aGF0IHdlJ3JlIGV4ZWN1dGluZyBpbiB0aGUgY29udGV4dCBvZlxuICAgICAgICAvLyAoZm9yIGNvbnNpc3RlbmN5IHdpdGggbXV0YXRpbmcgcmVndWxhciBvYnNlcnZhYmxlcylcbiAgICAgICAgdmFyIHVuZGVybHlpbmdBcnJheSA9IHRoaXMucGVlaygpO1xuICAgICAgICB0aGlzLnZhbHVlV2lsbE11dGF0ZSgpO1xuICAgICAgICB0aGlzLmNhY2hlRGlmZkZvcktub3duT3BlcmF0aW9uKHVuZGVybHlpbmdBcnJheSwgbWV0aG9kTmFtZSwgYXJndW1lbnRzKTtcbiAgICAgICAgdmFyIG1ldGhvZENhbGxSZXN1bHQgPSB1bmRlcmx5aW5nQXJyYXlbbWV0aG9kTmFtZV0uYXBwbHkodW5kZXJseWluZ0FycmF5LCBhcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnZhbHVlSGFzTXV0YXRlZCgpO1xuICAgICAgICAvLyBUaGUgbmF0aXZlIHNvcnQgYW5kIHJldmVyc2UgbWV0aG9kcyByZXR1cm4gYSByZWZlcmVuY2UgdG8gdGhlIGFycmF5LCBidXQgaXQgbWFrZXMgbW9yZSBzZW5zZSB0byByZXR1cm4gdGhlIG9ic2VydmFibGUgYXJyYXkgaW5zdGVhZC5cbiAgICAgICAgcmV0dXJuIG1ldGhvZENhbGxSZXN1bHQgPT09IHVuZGVybHlpbmdBcnJheSA/IHRoaXMgOiBtZXRob2RDYWxsUmVzdWx0O1xuICAgIH07XG59KTtcblxuLy8gUG9wdWxhdGUga28ub2JzZXJ2YWJsZUFycmF5LmZuIHdpdGggcmVhZC1vbmx5IGZ1bmN0aW9ucyBmcm9tIG5hdGl2ZSBhcnJheXNcbmtvLnV0aWxzLmFycmF5Rm9yRWFjaChbXCJzbGljZVwiXSwgZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcbiAgICBrby5vYnNlcnZhYmxlQXJyYXlbJ2ZuJ11bbWV0aG9kTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1bmRlcmx5aW5nQXJyYXkgPSB0aGlzKCk7XG4gICAgICAgIHJldHVybiB1bmRlcmx5aW5nQXJyYXlbbWV0aG9kTmFtZV0uYXBwbHkodW5kZXJseWluZ0FycmF5LCBhcmd1bWVudHMpO1xuICAgIH07XG59KTtcblxua28uZXhwb3J0U3ltYm9sKCdvYnNlcnZhYmxlQXJyYXknLCBrby5vYnNlcnZhYmxlQXJyYXkpO1xudmFyIGFycmF5Q2hhbmdlRXZlbnROYW1lID0gJ2FycmF5Q2hhbmdlJztcbmtvLmV4dGVuZGVyc1sndHJhY2tBcnJheUNoYW5nZXMnXSA9IGZ1bmN0aW9uKHRhcmdldCwgb3B0aW9ucykge1xuICAgIC8vIFVzZSB0aGUgcHJvdmlkZWQgb3B0aW9ucy0tZWFjaCBjYWxsIHRvIHRyYWNrQXJyYXlDaGFuZ2VzIG92ZXJ3cml0ZXMgdGhlIHByZXZpb3VzbHkgc2V0IG9wdGlvbnNcbiAgICB0YXJnZXQuY29tcGFyZUFycmF5T3B0aW9ucyA9IHt9O1xuICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAga28udXRpbHMuZXh0ZW5kKHRhcmdldC5jb21wYXJlQXJyYXlPcHRpb25zLCBvcHRpb25zKTtcbiAgICB9XG4gICAgdGFyZ2V0LmNvbXBhcmVBcnJheU9wdGlvbnNbJ3NwYXJzZSddID0gdHJ1ZTtcblxuICAgIC8vIE9ubHkgbW9kaWZ5IHRoZSB0YXJnZXQgb2JzZXJ2YWJsZSBvbmNlXG4gICAgaWYgKHRhcmdldC5jYWNoZURpZmZGb3JLbm93bk9wZXJhdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0cmFja2luZ0NoYW5nZXMgPSBmYWxzZSxcbiAgICAgICAgY2FjaGVkRGlmZiA9IG51bGwsXG4gICAgICAgIGFycmF5Q2hhbmdlU3Vic2NyaXB0aW9uLFxuICAgICAgICBwZW5kaW5nTm90aWZpY2F0aW9ucyA9IDAsXG4gICAgICAgIHVuZGVybHlpbmdOb3RpZnlTdWJzY3JpYmVyc0Z1bmN0aW9uLFxuICAgICAgICB1bmRlcmx5aW5nQmVmb3JlU3Vic2NyaXB0aW9uQWRkRnVuY3Rpb24gPSB0YXJnZXQuYmVmb3JlU3Vic2NyaXB0aW9uQWRkLFxuICAgICAgICB1bmRlcmx5aW5nQWZ0ZXJTdWJzY3JpcHRpb25SZW1vdmVGdW5jdGlvbiA9IHRhcmdldC5hZnRlclN1YnNjcmlwdGlvblJlbW92ZTtcblxuICAgIC8vIFdhdGNoIFwic3Vic2NyaWJlXCIgY2FsbHMsIGFuZCBmb3IgYXJyYXkgY2hhbmdlIGV2ZW50cywgZW5zdXJlIGNoYW5nZSB0cmFja2luZyBpcyBlbmFibGVkXG4gICAgdGFyZ2V0LmJlZm9yZVN1YnNjcmlwdGlvbkFkZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAodW5kZXJseWluZ0JlZm9yZVN1YnNjcmlwdGlvbkFkZEZ1bmN0aW9uKVxuICAgICAgICAgICAgdW5kZXJseWluZ0JlZm9yZVN1YnNjcmlwdGlvbkFkZEZ1bmN0aW9uLmNhbGwodGFyZ2V0LCBldmVudCk7XG4gICAgICAgIGlmIChldmVudCA9PT0gYXJyYXlDaGFuZ2VFdmVudE5hbWUpIHtcbiAgICAgICAgICAgIHRyYWNrQ2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvLyBXYXRjaCBcImRpc3Bvc2VcIiBjYWxscywgYW5kIGZvciBhcnJheSBjaGFuZ2UgZXZlbnRzLCBlbnN1cmUgY2hhbmdlIHRyYWNraW5nIGlzIGRpc2FibGVkIHdoZW4gYWxsIGFyZSBkaXNwb3NlZFxuICAgIHRhcmdldC5hZnRlclN1YnNjcmlwdGlvblJlbW92ZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAodW5kZXJseWluZ0FmdGVyU3Vic2NyaXB0aW9uUmVtb3ZlRnVuY3Rpb24pXG4gICAgICAgICAgICB1bmRlcmx5aW5nQWZ0ZXJTdWJzY3JpcHRpb25SZW1vdmVGdW5jdGlvbi5jYWxsKHRhcmdldCwgZXZlbnQpO1xuICAgICAgICBpZiAoZXZlbnQgPT09IGFycmF5Q2hhbmdlRXZlbnROYW1lICYmICF0YXJnZXQuaGFzU3Vic2NyaXB0aW9uc0ZvckV2ZW50KGFycmF5Q2hhbmdlRXZlbnROYW1lKSkge1xuICAgICAgICAgICAgaWYgKHVuZGVybHlpbmdOb3RpZnlTdWJzY3JpYmVyc0Z1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Wydub3RpZnlTdWJzY3JpYmVycyddID0gdW5kZXJseWluZ05vdGlmeVN1YnNjcmliZXJzRnVuY3Rpb247XG4gICAgICAgICAgICAgICAgdW5kZXJseWluZ05vdGlmeVN1YnNjcmliZXJzRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcnJheUNoYW5nZVN1YnNjcmlwdGlvbi5kaXNwb3NlKCk7XG4gICAgICAgICAgICB0cmFja2luZ0NoYW5nZXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiB0cmFja0NoYW5nZXMoKSB7XG4gICAgICAgIC8vIENhbGxpbmcgJ3RyYWNrQ2hhbmdlcycgbXVsdGlwbGUgdGltZXMgaXMgdGhlIHNhbWUgYXMgY2FsbGluZyBpdCBvbmNlXG4gICAgICAgIGlmICh0cmFja2luZ0NoYW5nZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyYWNraW5nQ2hhbmdlcyA9IHRydWU7XG5cbiAgICAgICAgLy8gSW50ZXJjZXB0IFwibm90aWZ5U3Vic2NyaWJlcnNcIiB0byB0cmFjayBob3cgbWFueSB0aW1lcyBpdCB3YXMgY2FsbGVkLlxuICAgICAgICB1bmRlcmx5aW5nTm90aWZ5U3Vic2NyaWJlcnNGdW5jdGlvbiA9IHRhcmdldFsnbm90aWZ5U3Vic2NyaWJlcnMnXTtcbiAgICAgICAgdGFyZ2V0Wydub3RpZnlTdWJzY3JpYmVycyddID0gZnVuY3Rpb24odmFsdWVUb05vdGlmeSwgZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICghZXZlbnQgfHwgZXZlbnQgPT09IGRlZmF1bHRFdmVudCkge1xuICAgICAgICAgICAgICAgICsrcGVuZGluZ05vdGlmaWNhdGlvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5kZXJseWluZ05vdGlmeVN1YnNjcmliZXJzRnVuY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBFYWNoIHRpbWUgdGhlIGFycmF5IGNoYW5nZXMgdmFsdWUsIGNhcHR1cmUgYSBjbG9uZSBzbyB0aGF0IG9uIHRoZSBuZXh0XG4gICAgICAgIC8vIGNoYW5nZSBpdCdzIHBvc3NpYmxlIHRvIHByb2R1Y2UgYSBkaWZmXG4gICAgICAgIHZhciBwcmV2aW91c0NvbnRlbnRzID0gW10uY29uY2F0KHRhcmdldC5wZWVrKCkgfHwgW10pO1xuICAgICAgICBjYWNoZWREaWZmID0gbnVsbDtcbiAgICAgICAgYXJyYXlDaGFuZ2VTdWJzY3JpcHRpb24gPSB0YXJnZXQuc3Vic2NyaWJlKGZ1bmN0aW9uKGN1cnJlbnRDb250ZW50cykge1xuICAgICAgICAgICAgLy8gTWFrZSBhIGNvcHkgb2YgdGhlIGN1cnJlbnQgY29udGVudHMgYW5kIGVuc3VyZSBpdCdzIGFuIGFycmF5XG4gICAgICAgICAgICBjdXJyZW50Q29udGVudHMgPSBbXS5jb25jYXQoY3VycmVudENvbnRlbnRzIHx8IFtdKTtcblxuICAgICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgZGlmZiBhbmQgaXNzdWUgbm90aWZpY2F0aW9ucywgYnV0IG9ubHkgaWYgc29tZW9uZSBpcyBsaXN0ZW5pbmdcbiAgICAgICAgICAgIGlmICh0YXJnZXQuaGFzU3Vic2NyaXB0aW9uc0ZvckV2ZW50KGFycmF5Q2hhbmdlRXZlbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIHZhciBjaGFuZ2VzID0gZ2V0Q2hhbmdlcyhwcmV2aW91c0NvbnRlbnRzLCBjdXJyZW50Q29udGVudHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFbGltaW5hdGUgcmVmZXJlbmNlcyB0byB0aGUgb2xkLCByZW1vdmVkIGl0ZW1zLCBzbyB0aGV5IGNhbiBiZSBHQ2VkXG4gICAgICAgICAgICBwcmV2aW91c0NvbnRlbnRzID0gY3VycmVudENvbnRlbnRzO1xuICAgICAgICAgICAgY2FjaGVkRGlmZiA9IG51bGw7XG4gICAgICAgICAgICBwZW5kaW5nTm90aWZpY2F0aW9ucyA9IDA7XG5cbiAgICAgICAgICAgIGlmIChjaGFuZ2VzICYmIGNoYW5nZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Wydub3RpZnlTdWJzY3JpYmVycyddKGNoYW5nZXMsIGFycmF5Q2hhbmdlRXZlbnROYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q2hhbmdlcyhwcmV2aW91c0NvbnRlbnRzLCBjdXJyZW50Q29udGVudHMpIHtcbiAgICAgICAgLy8gV2UgdHJ5IHRvIHJlLXVzZSBjYWNoZWQgZGlmZnMuXG4gICAgICAgIC8vIFRoZSBzY2VuYXJpb3Mgd2hlcmUgcGVuZGluZ05vdGlmaWNhdGlvbnMgPiAxIGFyZSB3aGVuIHVzaW5nIHJhdGUtbGltaXRpbmcgb3IgdGhlIERlZmVycmVkIFVwZGF0ZXNcbiAgICAgICAgLy8gcGx1Z2luLCB3aGljaCB3aXRob3V0IHRoaXMgY2hlY2sgd291bGQgbm90IGJlIGNvbXBhdGlibGUgd2l0aCBhcnJheUNoYW5nZSBub3RpZmljYXRpb25zLiBOb3JtYWxseSxcbiAgICAgICAgLy8gbm90aWZpY2F0aW9ucyBhcmUgaXNzdWVkIGltbWVkaWF0ZWx5IHNvIHdlIHdvdWxkbid0IGJlIHF1ZXVlaW5nIHVwIG1vcmUgdGhhbiBvbmUuXG4gICAgICAgIGlmICghY2FjaGVkRGlmZiB8fCBwZW5kaW5nTm90aWZpY2F0aW9ucyA+IDEpIHtcbiAgICAgICAgICAgIGNhY2hlZERpZmYgPSBrby51dGlscy5jb21wYXJlQXJyYXlzKHByZXZpb3VzQ29udGVudHMsIGN1cnJlbnRDb250ZW50cywgdGFyZ2V0LmNvbXBhcmVBcnJheU9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNhY2hlZERpZmY7XG4gICAgfVxuXG4gICAgdGFyZ2V0LmNhY2hlRGlmZkZvcktub3duT3BlcmF0aW9uID0gZnVuY3Rpb24ocmF3QXJyYXksIG9wZXJhdGlvbk5hbWUsIGFyZ3MpIHtcbiAgICAgICAgLy8gT25seSBydW4gaWYgd2UncmUgY3VycmVudGx5IHRyYWNraW5nIGNoYW5nZXMgZm9yIHRoaXMgb2JzZXJ2YWJsZSBhcnJheVxuICAgICAgICAvLyBhbmQgdGhlcmUgYXJlbid0IGFueSBwZW5kaW5nIGRlZmVycmVkIG5vdGlmaWNhdGlvbnMuXG4gICAgICAgIGlmICghdHJhY2tpbmdDaGFuZ2VzIHx8IHBlbmRpbmdOb3RpZmljYXRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRpZmYgPSBbXSxcbiAgICAgICAgICAgIGFycmF5TGVuZ3RoID0gcmF3QXJyYXkubGVuZ3RoLFxuICAgICAgICAgICAgYXJnc0xlbmd0aCA9IGFyZ3MubGVuZ3RoLFxuICAgICAgICAgICAgb2Zmc2V0ID0gMDtcblxuICAgICAgICBmdW5jdGlvbiBwdXNoRGlmZihzdGF0dXMsIHZhbHVlLCBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIGRpZmZbZGlmZi5sZW5ndGhdID0geyAnc3RhdHVzJzogc3RhdHVzLCAndmFsdWUnOiB2YWx1ZSwgJ2luZGV4JzogaW5kZXggfTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKG9wZXJhdGlvbk5hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3B1c2gnOlxuICAgICAgICAgICAgICAgIG9mZnNldCA9IGFycmF5TGVuZ3RoO1xuICAgICAgICAgICAgY2FzZSAndW5zaGlmdCc6XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGFyZ3NMZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaERpZmYoJ2FkZGVkJywgYXJnc1tpbmRleF0sIG9mZnNldCArIGluZGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3BvcCc6XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gYXJyYXlMZW5ndGggLSAxO1xuICAgICAgICAgICAgY2FzZSAnc2hpZnQnOlxuICAgICAgICAgICAgICAgIGlmIChhcnJheUxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBwdXNoRGlmZignZGVsZXRlZCcsIHJhd0FycmF5W29mZnNldF0sIG9mZnNldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdzcGxpY2UnOlxuICAgICAgICAgICAgICAgIC8vIE5lZ2F0aXZlIHN0YXJ0IGluZGV4IG1lYW5zICdmcm9tIGVuZCBvZiBhcnJheScuIEFmdGVyIHRoYXQgd2UgY2xhbXAgdG8gWzAuLi5hcnJheUxlbmd0aF0uXG4gICAgICAgICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3NwbGljZVxuICAgICAgICAgICAgICAgIHZhciBzdGFydEluZGV4ID0gTWF0aC5taW4oTWF0aC5tYXgoMCwgYXJnc1swXSA8IDAgPyBhcnJheUxlbmd0aCArIGFyZ3NbMF0gOiBhcmdzWzBdKSwgYXJyYXlMZW5ndGgpLFxuICAgICAgICAgICAgICAgICAgICBlbmREZWxldGVJbmRleCA9IGFyZ3NMZW5ndGggPT09IDEgPyBhcnJheUxlbmd0aCA6IE1hdGgubWluKHN0YXJ0SW5kZXggKyAoYXJnc1sxXSB8fCAwKSwgYXJyYXlMZW5ndGgpLFxuICAgICAgICAgICAgICAgICAgICBlbmRBZGRJbmRleCA9IHN0YXJ0SW5kZXggKyBhcmdzTGVuZ3RoIC0gMixcbiAgICAgICAgICAgICAgICAgICAgZW5kSW5kZXggPSBNYXRoLm1heChlbmREZWxldGVJbmRleCwgZW5kQWRkSW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbnMgPSBbXSwgZGVsZXRpb25zID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggPSBzdGFydEluZGV4LCBhcmdzSW5kZXggPSAyOyBpbmRleCA8IGVuZEluZGV4OyArK2luZGV4LCArK2FyZ3NJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBlbmREZWxldGVJbmRleClcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0aW9ucy5wdXNoKHB1c2hEaWZmKCdkZWxldGVkJywgcmF3QXJyYXlbaW5kZXhdLCBpbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBlbmRBZGRJbmRleClcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGl0aW9ucy5wdXNoKHB1c2hEaWZmKCdhZGRlZCcsIGFyZ3NbYXJnc0luZGV4XSwgaW5kZXgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAga28udXRpbHMuZmluZE1vdmVzSW5BcnJheUNvbXBhcmlzb24oZGVsZXRpb25zLCBhZGRpdGlvbnMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYWNoZWREaWZmID0gZGlmZjtcbiAgICB9O1xufTtcbnZhciBjb21wdXRlZFN0YXRlID0ga28udXRpbHMuY3JlYXRlU3ltYm9sT3JTdHJpbmcoJ19zdGF0ZScpO1xuXG5rby5jb21wdXRlZCA9IGtvLmRlcGVuZGVudE9ic2VydmFibGUgPSBmdW5jdGlvbiAoZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMsIGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAvLyBTaW5nbGUtcGFyYW1ldGVyIHN5bnRheCAtIGV2ZXJ5dGhpbmcgaXMgb24gdGhpcyBcIm9wdGlvbnNcIiBwYXJhbVxuICAgICAgICBvcHRpb25zID0gZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTXVsdGktcGFyYW1ldGVyIHN5bnRheCAtIGNvbnN0cnVjdCB0aGUgb3B0aW9ucyBhY2NvcmRpbmcgdG8gdGhlIHBhcmFtcyBwYXNzZWRcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIGlmIChldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9uc1tcInJlYWRcIl0gPSBldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnNbXCJyZWFkXCJdICE9IFwiZnVuY3Rpb25cIilcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJQYXNzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUga28uY29tcHV0ZWRcIik7XG5cbiAgICB2YXIgd3JpdGVGdW5jdGlvbiA9IG9wdGlvbnNbXCJ3cml0ZVwiXTtcbiAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgIGxhdGVzdFZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgIGlzU3RhbGU6IHRydWUsXG4gICAgICAgIGlzQmVpbmdFdmFsdWF0ZWQ6IGZhbHNlLFxuICAgICAgICBzdXBwcmVzc0Rpc3Bvc2FsVW50aWxEaXNwb3NlV2hlblJldHVybnNGYWxzZTogZmFsc2UsXG4gICAgICAgIGlzRGlzcG9zZWQ6IGZhbHNlLFxuICAgICAgICBwdXJlOiBmYWxzZSxcbiAgICAgICAgaXNTbGVlcGluZzogZmFsc2UsXG4gICAgICAgIHJlYWRGdW5jdGlvbjogb3B0aW9uc1tcInJlYWRcIl0sXG4gICAgICAgIGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0OiBldmFsdWF0b3JGdW5jdGlvblRhcmdldCB8fCBvcHRpb25zW1wib3duZXJcIl0sXG4gICAgICAgIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogb3B0aW9uc1tcImRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZFwiXSB8fCBvcHRpb25zLmRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCB8fCBudWxsLFxuICAgICAgICBkaXNwb3NlV2hlbjogb3B0aW9uc1tcImRpc3Bvc2VXaGVuXCJdIHx8IG9wdGlvbnMuZGlzcG9zZVdoZW4sXG4gICAgICAgIGRvbU5vZGVEaXNwb3NhbENhbGxiYWNrOiBudWxsLFxuICAgICAgICBkZXBlbmRlbmN5VHJhY2tpbmc6IHt9LFxuICAgICAgICBkZXBlbmRlbmNpZXNDb3VudDogMCxcbiAgICAgICAgZXZhbHVhdGlvblRpbWVvdXRJbnN0YW5jZTogbnVsbFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlZE9ic2VydmFibGUoKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB3cml0ZUZ1bmN0aW9uID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBXcml0aW5nIGEgdmFsdWVcbiAgICAgICAgICAgICAgICB3cml0ZUZ1bmN0aW9uLmFwcGx5KHN0YXRlLmV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3Qgd3JpdGUgYSB2YWx1ZSB0byBhIGtvLmNvbXB1dGVkIHVubGVzcyB5b3Ugc3BlY2lmeSBhICd3cml0ZScgb3B0aW9uLiBJZiB5b3Ugd2lzaCB0byByZWFkIHRoZSBjdXJyZW50IHZhbHVlLCBkb24ndCBwYXNzIGFueSBwYXJhbWV0ZXJzLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzOyAvLyBQZXJtaXRzIGNoYWluZWQgYXNzaWdubWVudHNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJlYWRpbmcgdGhlIHZhbHVlXG4gICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLnJlZ2lzdGVyRGVwZW5kZW5jeShjb21wdXRlZE9ic2VydmFibGUpO1xuICAgICAgICAgICAgaWYgKHN0YXRlLmlzU3RhbGUgfHwgKHN0YXRlLmlzU2xlZXBpbmcgJiYgY29tcHV0ZWRPYnNlcnZhYmxlLmhhdmVEZXBlbmRlbmNpZXNDaGFuZ2VkKCkpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlLmV2YWx1YXRlSW1tZWRpYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUubGF0ZXN0VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb21wdXRlZE9ic2VydmFibGVbY29tcHV0ZWRTdGF0ZV0gPSBzdGF0ZTtcbiAgICBjb21wdXRlZE9ic2VydmFibGUuaGFzV3JpdGVGdW5jdGlvbiA9IHR5cGVvZiB3cml0ZUZ1bmN0aW9uID09PSBcImZ1bmN0aW9uXCI7XG5cbiAgICAvLyBJbmhlcml0IGZyb20gJ3N1YnNjcmliYWJsZSdcbiAgICBpZiAoIWtvLnV0aWxzLmNhblNldFByb3RvdHlwZSkge1xuICAgICAgICAvLyAnc3Vic2NyaWJhYmxlJyB3b24ndCBiZSBvbiB0aGUgcHJvdG90eXBlIGNoYWluIHVubGVzcyB3ZSBwdXQgaXQgdGhlcmUgZGlyZWN0bHlcbiAgICAgICAga28udXRpbHMuZXh0ZW5kKGNvbXB1dGVkT2JzZXJ2YWJsZSwga28uc3Vic2NyaWJhYmxlWydmbiddKTtcbiAgICB9XG4gICAga28uc3Vic2NyaWJhYmxlWydmbiddLmluaXQoY29tcHV0ZWRPYnNlcnZhYmxlKTtcblxuICAgIC8vIEluaGVyaXQgZnJvbSAnY29tcHV0ZWQnXG4gICAga28udXRpbHMuc2V0UHJvdG90eXBlT2ZPckV4dGVuZChjb21wdXRlZE9ic2VydmFibGUsIGNvbXB1dGVkRm4pO1xuXG4gICAgaWYgKG9wdGlvbnNbJ3B1cmUnXSkge1xuICAgICAgICBzdGF0ZS5wdXJlID0gdHJ1ZTtcbiAgICAgICAgc3RhdGUuaXNTbGVlcGluZyA9IHRydWU7ICAgICAvLyBTdGFydHMgb2ZmIHNsZWVwaW5nOyB3aWxsIGF3YWtlIG9uIHRoZSBmaXJzdCBzdWJzY3JpcHRpb25cbiAgICAgICAga28udXRpbHMuZXh0ZW5kKGNvbXB1dGVkT2JzZXJ2YWJsZSwgcHVyZUNvbXB1dGVkT3ZlcnJpZGVzKTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnNbJ2RlZmVyRXZhbHVhdGlvbiddKSB7XG4gICAgICAgIGtvLnV0aWxzLmV4dGVuZChjb21wdXRlZE9ic2VydmFibGUsIGRlZmVyRXZhbHVhdGlvbk92ZXJyaWRlcyk7XG4gICAgfVxuXG4gICAgaWYgKGtvLm9wdGlvbnNbJ2RlZmVyVXBkYXRlcyddKSB7XG4gICAgICAgIGtvLmV4dGVuZGVyc1snZGVmZXJyZWQnXShjb21wdXRlZE9ic2VydmFibGUsIHRydWUpO1xuICAgIH1cblxuICAgIGlmIChERUJVRykge1xuICAgICAgICAvLyAjMTczMSAtIEFpZCBkZWJ1Z2dpbmcgYnkgZXhwb3NpbmcgdGhlIGNvbXB1dGVkJ3Mgb3B0aW9uc1xuICAgICAgICBjb21wdXRlZE9ic2VydmFibGVbXCJfb3B0aW9uc1wiXSA9IG9wdGlvbnM7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLmRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCkge1xuICAgICAgICAvLyBTaW5jZSB0aGlzIGNvbXB1dGVkIGlzIGFzc29jaWF0ZWQgd2l0aCBhIERPTSBub2RlLCBhbmQgd2UgZG9uJ3Qgd2FudCB0byBkaXNwb3NlIHRoZSBjb21wdXRlZFxuICAgICAgICAvLyB1bnRpbCB0aGUgRE9NIG5vZGUgaXMgKnJlbW92ZWQqIGZyb20gdGhlIGRvY3VtZW50IChhcyBvcHBvc2VkIHRvIG5ldmVyIGhhdmluZyBiZWVuIGluIHRoZSBkb2N1bWVudCksXG4gICAgICAgIC8vIHdlJ2xsIHByZXZlbnQgZGlzcG9zYWwgdW50aWwgXCJkaXNwb3NlV2hlblwiIGZpcnN0IHJldHVybnMgZmFsc2UuXG4gICAgICAgIHN0YXRlLnN1cHByZXNzRGlzcG9zYWxVbnRpbERpc3Bvc2VXaGVuUmV0dXJuc0ZhbHNlID0gdHJ1ZTtcblxuICAgICAgICAvLyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IHRydWUgY2FuIGJlIHVzZWQgdG8gb3B0IGludG8gdGhlIFwib25seSBkaXNwb3NlIGFmdGVyIGZpcnN0IGZhbHNlIHJlc3VsdFwiXG4gICAgICAgIC8vIGJlaGF2aW91ciBldmVuIGlmIHRoZXJlJ3Mgbm8gc3BlY2lmaWMgbm9kZSB0byB3YXRjaC4gSW4gdGhhdCBjYXNlLCBjbGVhciB0aGUgb3B0aW9uIHNvIHdlIGRvbid0IHRyeVxuICAgICAgICAvLyB0byB3YXRjaCBmb3IgYSBub24tbm9kZSdzIGRpc3Bvc2FsLiBUaGlzIHRlY2huaXF1ZSBpcyBpbnRlbmRlZCBmb3IgS08ncyBpbnRlcm5hbCB1c2Ugb25seSBhbmQgc2hvdWxkbid0XG4gICAgICAgIC8vIGJlIGRvY3VtZW50ZWQgb3IgdXNlZCBieSBhcHBsaWNhdGlvbiBjb2RlLCBhcyBpdCdzIGxpa2VseSB0byBjaGFuZ2UgaW4gYSBmdXR1cmUgdmVyc2lvbiBvZiBLTy5cbiAgICAgICAgaWYgKCFzdGF0ZS5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQubm9kZVR5cGUpIHtcbiAgICAgICAgICAgIHN0YXRlLmRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFdmFsdWF0ZSwgdW5sZXNzIHNsZWVwaW5nIG9yIGRlZmVyRXZhbHVhdGlvbiBpcyB0cnVlXG4gICAgaWYgKCFzdGF0ZS5pc1NsZWVwaW5nICYmICFvcHRpb25zWydkZWZlckV2YWx1YXRpb24nXSkge1xuICAgICAgICBjb21wdXRlZE9ic2VydmFibGUuZXZhbHVhdGVJbW1lZGlhdGUoKTtcbiAgICB9XG5cbiAgICAvLyBBdHRhY2ggYSBET00gbm9kZSBkaXNwb3NhbCBjYWxsYmFjayBzbyB0aGF0IHRoZSBjb21wdXRlZCB3aWxsIGJlIHByb2FjdGl2ZWx5IGRpc3Bvc2VkIGFzIHNvb24gYXMgdGhlIG5vZGUgaXNcbiAgICAvLyByZW1vdmVkIHVzaW5nIGtvLnJlbW92ZU5vZGUuIEJ1dCBza2lwIGlmIGlzQWN0aXZlIGlzIGZhbHNlICh0aGVyZSB3aWxsIG5ldmVyIGJlIGFueSBkZXBlbmRlbmNpZXMgdG8gZGlzcG9zZSkuXG4gICAgaWYgKHN0YXRlLmRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCAmJiBjb21wdXRlZE9ic2VydmFibGUuaXNBY3RpdmUoKSkge1xuICAgICAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKHN0YXRlLmRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCwgc3RhdGUuZG9tTm9kZURpc3Bvc2FsQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb21wdXRlZE9ic2VydmFibGUuZGlzcG9zZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29tcHV0ZWRPYnNlcnZhYmxlO1xufTtcblxuLy8gVXRpbGl0eSBmdW5jdGlvbiB0aGF0IGRpc3Bvc2VzIGEgZ2l2ZW4gZGVwZW5kZW5jeVRyYWNraW5nIGVudHJ5XG5mdW5jdGlvbiBjb21wdXRlZERpc3Bvc2VEZXBlbmRlbmN5Q2FsbGJhY2soaWQsIGVudHJ5VG9EaXNwb3NlKSB7XG4gICAgaWYgKGVudHJ5VG9EaXNwb3NlICE9PSBudWxsICYmIGVudHJ5VG9EaXNwb3NlLmRpc3Bvc2UpIHtcbiAgICAgICAgZW50cnlUb0Rpc3Bvc2UuZGlzcG9zZSgpO1xuICAgIH1cbn1cblxuLy8gVGhpcyBmdW5jdGlvbiBnZXRzIGNhbGxlZCBlYWNoIHRpbWUgYSBkZXBlbmRlbmN5IGlzIGRldGVjdGVkIHdoaWxlIGV2YWx1YXRpbmcgYSBjb21wdXRlZC5cbi8vIEl0J3MgZmFjdG9yZWQgb3V0IGFzIGEgc2hhcmVkIGZ1bmN0aW9uIHRvIGF2b2lkIGNyZWF0aW5nIHVubmVjZXNzYXJ5IGZ1bmN0aW9uIGluc3RhbmNlcyBkdXJpbmcgZXZhbHVhdGlvbi5cbmZ1bmN0aW9uIGNvbXB1dGVkQmVnaW5EZXBlbmRlbmN5RGV0ZWN0aW9uQ2FsbGJhY2soc3Vic2NyaWJhYmxlLCBpZCkge1xuICAgIHZhciBjb21wdXRlZE9ic2VydmFibGUgPSB0aGlzLmNvbXB1dGVkT2JzZXJ2YWJsZSxcbiAgICAgICAgc3RhdGUgPSBjb21wdXRlZE9ic2VydmFibGVbY29tcHV0ZWRTdGF0ZV07XG4gICAgaWYgKCFzdGF0ZS5pc0Rpc3Bvc2VkKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc3Bvc2FsQ291bnQgJiYgdGhpcy5kaXNwb3NhbENhbmRpZGF0ZXNbaWRdKSB7XG4gICAgICAgICAgICAvLyBEb24ndCB3YW50IHRvIGRpc3Bvc2UgdGhpcyBzdWJzY3JpcHRpb24sIGFzIGl0J3Mgc3RpbGwgYmVpbmcgdXNlZFxuICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlLmFkZERlcGVuZGVuY3lUcmFja2luZyhpZCwgc3Vic2NyaWJhYmxlLCB0aGlzLmRpc3Bvc2FsQ2FuZGlkYXRlc1tpZF0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwb3NhbENhbmRpZGF0ZXNbaWRdID0gbnVsbDsgLy8gTm8gbmVlZCB0byBhY3R1YWxseSBkZWxldGUgdGhlIHByb3BlcnR5IC0gZGlzcG9zYWxDYW5kaWRhdGVzIGlzIGEgdHJhbnNpZW50IG9iamVjdCBhbnl3YXlcbiAgICAgICAgICAgIC0tdGhpcy5kaXNwb3NhbENvdW50O1xuICAgICAgICB9IGVsc2UgaWYgKCFzdGF0ZS5kZXBlbmRlbmN5VHJhY2tpbmdbaWRdKSB7XG4gICAgICAgICAgICAvLyBCcmFuZCBuZXcgc3Vic2NyaXB0aW9uIC0gYWRkIGl0XG4gICAgICAgICAgICBjb21wdXRlZE9ic2VydmFibGUuYWRkRGVwZW5kZW5jeVRyYWNraW5nKGlkLCBzdWJzY3JpYmFibGUsIHN0YXRlLmlzU2xlZXBpbmcgPyB7IF90YXJnZXQ6IHN1YnNjcmliYWJsZSB9IDogY29tcHV0ZWRPYnNlcnZhYmxlLnN1YnNjcmliZVRvRGVwZW5kZW5jeShzdWJzY3JpYmFibGUpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxudmFyIGNvbXB1dGVkRm4gPSB7XG4gICAgXCJlcXVhbGl0eUNvbXBhcmVyXCI6IHZhbHVlc0FyZVByaW1pdGl2ZUFuZEVxdWFsLFxuICAgIGdldERlcGVuZGVuY2llc0NvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzW2NvbXB1dGVkU3RhdGVdLmRlcGVuZGVuY2llc0NvdW50O1xuICAgIH0sXG4gICAgYWRkRGVwZW5kZW5jeVRyYWNraW5nOiBmdW5jdGlvbiAoaWQsIHRhcmdldCwgdHJhY2tpbmdPYmopIHtcbiAgICAgICAgaWYgKHRoaXNbY29tcHV0ZWRTdGF0ZV0ucHVyZSAmJiB0YXJnZXQgPT09IHRoaXMpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiQSAncHVyZScgY29tcHV0ZWQgbXVzdCBub3QgYmUgY2FsbGVkIHJlY3Vyc2l2ZWx5XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpc1tjb21wdXRlZFN0YXRlXS5kZXBlbmRlbmN5VHJhY2tpbmdbaWRdID0gdHJhY2tpbmdPYmo7XG4gICAgICAgIHRyYWNraW5nT2JqLl9vcmRlciA9IHRoaXNbY29tcHV0ZWRTdGF0ZV0uZGVwZW5kZW5jaWVzQ291bnQrKztcbiAgICAgICAgdHJhY2tpbmdPYmouX3ZlcnNpb24gPSB0YXJnZXQuZ2V0VmVyc2lvbigpO1xuICAgIH0sXG4gICAgaGF2ZURlcGVuZGVuY2llc0NoYW5nZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlkLCBkZXBlbmRlbmN5LCBkZXBlbmRlbmN5VHJhY2tpbmcgPSB0aGlzW2NvbXB1dGVkU3RhdGVdLmRlcGVuZGVuY3lUcmFja2luZztcbiAgICAgICAgZm9yIChpZCBpbiBkZXBlbmRlbmN5VHJhY2tpbmcpIHtcbiAgICAgICAgICAgIGlmIChkZXBlbmRlbmN5VHJhY2tpbmcuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jeSA9IGRlcGVuZGVuY3lUcmFja2luZ1tpZF07XG4gICAgICAgICAgICAgICAgaWYgKGRlcGVuZGVuY3kuX3RhcmdldC5oYXNDaGFuZ2VkKGRlcGVuZGVuY3kuX3ZlcnNpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgbWFya0RpcnR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFByb2Nlc3MgXCJkaXJ0eVwiIGV2ZW50cyBpZiB3ZSBjYW4gaGFuZGxlIGRlbGF5ZWQgbm90aWZpY2F0aW9uc1xuICAgICAgICBpZiAodGhpcy5fZXZhbERlbGF5ZWQgJiYgIXRoaXNbY29tcHV0ZWRTdGF0ZV0uaXNCZWluZ0V2YWx1YXRlZCkge1xuICAgICAgICAgICAgdGhpcy5fZXZhbERlbGF5ZWQoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaXNBY3RpdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbY29tcHV0ZWRTdGF0ZV0uaXNTdGFsZSB8fCB0aGlzW2NvbXB1dGVkU3RhdGVdLmRlcGVuZGVuY2llc0NvdW50ID4gMDtcbiAgICB9LFxuICAgIHJlc3BvbmRUb0NoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBJZ25vcmUgXCJjaGFuZ2VcIiBldmVudHMgaWYgd2UndmUgYWxyZWFkeSBzY2hlZHVsZWQgYSBkZWxheWVkIG5vdGlmaWNhdGlvblxuICAgICAgICBpZiAoIXRoaXMuX25vdGlmaWNhdGlvbklzUGVuZGluZykge1xuICAgICAgICAgICAgdGhpcy5ldmFsdWF0ZVBvc3NpYmx5QXN5bmMoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc3Vic2NyaWJlVG9EZXBlbmRlbmN5OiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIGlmICh0YXJnZXQuX2RlZmVyVXBkYXRlcyAmJiAhdGhpc1tjb21wdXRlZFN0YXRlXS5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQpIHtcbiAgICAgICAgICAgIHZhciBkaXJ0eVN1YiA9IHRhcmdldC5zdWJzY3JpYmUodGhpcy5tYXJrRGlydHksIHRoaXMsICdkaXJ0eScpLFxuICAgICAgICAgICAgICAgIGNoYW5nZVN1YiA9IHRhcmdldC5zdWJzY3JpYmUodGhpcy5yZXNwb25kVG9DaGFuZ2UsIHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBfdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgICAgICAgZGlzcG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBkaXJ0eVN1Yi5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZVN1Yi5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQuc3Vic2NyaWJlKHRoaXMuZXZhbHVhdGVQb3NzaWJseUFzeW5jLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZXZhbHVhdGVQb3NzaWJseUFzeW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb21wdXRlZE9ic2VydmFibGUgPSB0aGlzLFxuICAgICAgICAgICAgdGhyb3R0bGVFdmFsdWF0aW9uVGltZW91dCA9IGNvbXB1dGVkT2JzZXJ2YWJsZVsndGhyb3R0bGVFdmFsdWF0aW9uJ107XG4gICAgICAgIGlmICh0aHJvdHRsZUV2YWx1YXRpb25UaW1lb3V0ICYmIHRocm90dGxlRXZhbHVhdGlvblRpbWVvdXQgPj0gMCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXNbY29tcHV0ZWRTdGF0ZV0uZXZhbHVhdGlvblRpbWVvdXRJbnN0YW5jZSk7XG4gICAgICAgICAgICB0aGlzW2NvbXB1dGVkU3RhdGVdLmV2YWx1YXRpb25UaW1lb3V0SW5zdGFuY2UgPSBrby51dGlscy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlZE9ic2VydmFibGUuZXZhbHVhdGVJbW1lZGlhdGUodHJ1ZSAvKm5vdGlmeUNoYW5nZSovKTtcbiAgICAgICAgICAgIH0sIHRocm90dGxlRXZhbHVhdGlvblRpbWVvdXQpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbXB1dGVkT2JzZXJ2YWJsZS5fZXZhbERlbGF5ZWQpIHtcbiAgICAgICAgICAgIGNvbXB1dGVkT2JzZXJ2YWJsZS5fZXZhbERlbGF5ZWQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbXB1dGVkT2JzZXJ2YWJsZS5ldmFsdWF0ZUltbWVkaWF0ZSh0cnVlIC8qbm90aWZ5Q2hhbmdlKi8pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBldmFsdWF0ZUltbWVkaWF0ZTogZnVuY3Rpb24gKG5vdGlmeUNoYW5nZSkge1xuICAgICAgICB2YXIgY29tcHV0ZWRPYnNlcnZhYmxlID0gdGhpcyxcbiAgICAgICAgICAgIHN0YXRlID0gY29tcHV0ZWRPYnNlcnZhYmxlW2NvbXB1dGVkU3RhdGVdLFxuICAgICAgICAgICAgZGlzcG9zZVdoZW4gPSBzdGF0ZS5kaXNwb3NlV2hlbixcbiAgICAgICAgICAgIGNoYW5nZWQgPSBmYWxzZTtcblxuICAgICAgICBpZiAoc3RhdGUuaXNCZWluZ0V2YWx1YXRlZCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGV2YWx1YXRpb24gb2YgYSBrby5jb21wdXRlZCBjYXVzZXMgc2lkZSBlZmZlY3RzLCBpdCdzIHBvc3NpYmxlIHRoYXQgaXQgd2lsbCB0cmlnZ2VyIGl0cyBvd24gcmUtZXZhbHVhdGlvbi5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgbm90IGRlc2lyYWJsZSAoaXQncyBoYXJkIGZvciBhIGRldmVsb3BlciB0byByZWFsaXNlIGEgY2hhaW4gb2YgZGVwZW5kZW5jaWVzIG1pZ2h0IGNhdXNlIHRoaXMsIGFuZCB0aGV5IGFsbW9zdFxuICAgICAgICAgICAgLy8gY2VydGFpbmx5IGRpZG4ndCBpbnRlbmQgaW5maW5pdGUgcmUtZXZhbHVhdGlvbnMpLiBTbywgZm9yIHByZWRpY3RhYmlsaXR5LCB3ZSBzaW1wbHkgcHJldmVudCBrby5jb21wdXRlZHMgZnJvbSBjYXVzaW5nXG4gICAgICAgICAgICAvLyB0aGVpciBvd24gcmUtZXZhbHVhdGlvbi4gRnVydGhlciBkaXNjdXNzaW9uIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9wdWxsLzM4N1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRG8gbm90IGV2YWx1YXRlIChhbmQgcG9zc2libHkgY2FwdHVyZSBuZXcgZGVwZW5kZW5jaWVzKSBpZiBkaXNwb3NlZFxuICAgICAgICBpZiAoc3RhdGUuaXNEaXNwb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXRlLmRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCAmJiAha28udXRpbHMuZG9tTm9kZUlzQXR0YWNoZWRUb0RvY3VtZW50KHN0YXRlLmRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCkgfHwgZGlzcG9zZVdoZW4gJiYgZGlzcG9zZVdoZW4oKSkge1xuICAgICAgICAgICAgLy8gU2VlIGNvbW1lbnQgYWJvdmUgYWJvdXQgc3VwcHJlc3NEaXNwb3NhbFVudGlsRGlzcG9zZVdoZW5SZXR1cm5zRmFsc2VcbiAgICAgICAgICAgIGlmICghc3RhdGUuc3VwcHJlc3NEaXNwb3NhbFVudGlsRGlzcG9zZVdoZW5SZXR1cm5zRmFsc2UpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlZE9ic2VydmFibGUuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEl0IGp1c3QgZGlkIHJldHVybiBmYWxzZSwgc28gd2UgY2FuIHN0b3Agc3VwcHJlc3Npbmcgbm93XG4gICAgICAgICAgICBzdGF0ZS5zdXBwcmVzc0Rpc3Bvc2FsVW50aWxEaXNwb3NlV2hlblJldHVybnNGYWxzZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUuaXNCZWluZ0V2YWx1YXRlZCA9IHRydWU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjaGFuZ2VkID0gdGhpcy5ldmFsdWF0ZUltbWVkaWF0ZV9DYWxsUmVhZFdpdGhEZXBlbmRlbmN5RGV0ZWN0aW9uKG5vdGlmeUNoYW5nZSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzdGF0ZS5pc0JlaW5nRXZhbHVhdGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXN0YXRlLmRlcGVuZGVuY2llc0NvdW50KSB7XG4gICAgICAgICAgICBjb21wdXRlZE9ic2VydmFibGUuZGlzcG9zZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNoYW5nZWQ7XG4gICAgfSxcbiAgICBldmFsdWF0ZUltbWVkaWF0ZV9DYWxsUmVhZFdpdGhEZXBlbmRlbmN5RGV0ZWN0aW9uOiBmdW5jdGlvbiAobm90aWZ5Q2hhbmdlKSB7XG4gICAgICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgcmVhbGx5IGp1c3QgcGFydCBvZiB0aGUgZXZhbHVhdGVJbW1lZGlhdGUgbG9naWMuIFlvdSB3b3VsZCBuZXZlciBjYWxsIGl0IGZyb20gYW55d2hlcmUgZWxzZS5cbiAgICAgICAgLy8gRmFjdG9yaW5nIGl0IG91dCBpbnRvIGEgc2VwYXJhdGUgZnVuY3Rpb24gbWVhbnMgaXQgY2FuIGJlIGluZGVwZW5kZW50IG9mIHRoZSB0cnkvY2F0Y2ggYmxvY2sgaW4gZXZhbHVhdGVJbW1lZGlhdGUsXG4gICAgICAgIC8vIHdoaWNoIGNvbnRyaWJ1dGVzIHRvIHNhdmluZyBhYm91dCA0MCUgb2ZmIHRoZSBDUFUgb3ZlcmhlYWQgb2YgY29tcHV0ZWQgZXZhbHVhdGlvbiAob24gVjggYXQgbGVhc3QpLlxuXG4gICAgICAgIHZhciBjb21wdXRlZE9ic2VydmFibGUgPSB0aGlzLFxuICAgICAgICAgICAgc3RhdGUgPSBjb21wdXRlZE9ic2VydmFibGVbY29tcHV0ZWRTdGF0ZV0sXG4gICAgICAgICAgICBjaGFuZ2VkID0gZmFsc2U7XG5cbiAgICAgICAgLy8gSW5pdGlhbGx5LCB3ZSBhc3N1bWUgdGhhdCBub25lIG9mIHRoZSBzdWJzY3JpcHRpb25zIGFyZSBzdGlsbCBiZWluZyB1c2VkIChpLmUuLCBhbGwgYXJlIGNhbmRpZGF0ZXMgZm9yIGRpc3Bvc2FsKS5cbiAgICAgICAgLy8gVGhlbiwgZHVyaW5nIGV2YWx1YXRpb24sIHdlIGNyb3NzIG9mZiBhbnkgdGhhdCBhcmUgaW4gZmFjdCBzdGlsbCBiZWluZyB1c2VkLlxuICAgICAgICB2YXIgaXNJbml0aWFsID0gc3RhdGUucHVyZSA/IHVuZGVmaW5lZCA6ICFzdGF0ZS5kZXBlbmRlbmNpZXNDb3VudCwgICAvLyBJZiB3ZSdyZSBldmFsdWF0aW5nIHdoZW4gdGhlcmUgYXJlIG5vIHByZXZpb3VzIGRlcGVuZGVuY2llcywgaXQgbXVzdCBiZSB0aGUgZmlyc3QgdGltZVxuICAgICAgICAgICAgZGVwZW5kZW5jeURldGVjdGlvbkNvbnRleHQgPSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlOiBjb21wdXRlZE9ic2VydmFibGUsXG4gICAgICAgICAgICAgICAgZGlzcG9zYWxDYW5kaWRhdGVzOiBzdGF0ZS5kZXBlbmRlbmN5VHJhY2tpbmcsXG4gICAgICAgICAgICAgICAgZGlzcG9zYWxDb3VudDogc3RhdGUuZGVwZW5kZW5jaWVzQ291bnRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5iZWdpbih7XG4gICAgICAgICAgICBjYWxsYmFja1RhcmdldDogZGVwZW5kZW5jeURldGVjdGlvbkNvbnRleHQsXG4gICAgICAgICAgICBjYWxsYmFjazogY29tcHV0ZWRCZWdpbkRlcGVuZGVuY3lEZXRlY3Rpb25DYWxsYmFjayxcbiAgICAgICAgICAgIGNvbXB1dGVkOiBjb21wdXRlZE9ic2VydmFibGUsXG4gICAgICAgICAgICBpc0luaXRpYWw6IGlzSW5pdGlhbFxuICAgICAgICB9KTtcblxuICAgICAgICBzdGF0ZS5kZXBlbmRlbmN5VHJhY2tpbmcgPSB7fTtcbiAgICAgICAgc3RhdGUuZGVwZW5kZW5jaWVzQ291bnQgPSAwO1xuXG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMuZXZhbHVhdGVJbW1lZGlhdGVfQ2FsbFJlYWRUaGVuRW5kRGVwZW5kZW5jeURldGVjdGlvbihzdGF0ZSwgZGVwZW5kZW5jeURldGVjdGlvbkNvbnRleHQpO1xuXG4gICAgICAgIGlmIChjb21wdXRlZE9ic2VydmFibGUuaXNEaWZmZXJlbnQoc3RhdGUubGF0ZXN0VmFsdWUsIG5ld1ZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKCFzdGF0ZS5pc1NsZWVwaW5nKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlW1wibm90aWZ5U3Vic2NyaWJlcnNcIl0oc3RhdGUubGF0ZXN0VmFsdWUsIFwiYmVmb3JlQ2hhbmdlXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdGF0ZS5sYXRlc3RWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgaWYgKERFQlVHKSBjb21wdXRlZE9ic2VydmFibGUuX2xhdGVzdFZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5pc1NsZWVwaW5nKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlLnVwZGF0ZVZlcnNpb24oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm90aWZ5Q2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlW1wibm90aWZ5U3Vic2NyaWJlcnNcIl0oc3RhdGUubGF0ZXN0VmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0luaXRpYWwpIHtcbiAgICAgICAgICAgIGNvbXB1dGVkT2JzZXJ2YWJsZVtcIm5vdGlmeVN1YnNjcmliZXJzXCJdKHN0YXRlLmxhdGVzdFZhbHVlLCBcImF3YWtlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNoYW5nZWQ7XG4gICAgfSxcbiAgICBldmFsdWF0ZUltbWVkaWF0ZV9DYWxsUmVhZFRoZW5FbmREZXBlbmRlbmN5RGV0ZWN0aW9uOiBmdW5jdGlvbiAoc3RhdGUsIGRlcGVuZGVuY3lEZXRlY3Rpb25Db250ZXh0KSB7XG4gICAgICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgcmVhbGx5IHBhcnQgb2YgdGhlIGV2YWx1YXRlSW1tZWRpYXRlX0NhbGxSZWFkV2l0aERlcGVuZGVuY3lEZXRlY3Rpb24gbG9naWMuXG4gICAgICAgIC8vIFlvdSdkIG5ldmVyIGNhbGwgaXQgZnJvbSBhbnl3aGVyZSBlbHNlLiBGYWN0b3JpbmcgaXQgb3V0IG1lYW5zIHRoYXQgZXZhbHVhdGVJbW1lZGlhdGVfQ2FsbFJlYWRXaXRoRGVwZW5kZW5jeURldGVjdGlvblxuICAgICAgICAvLyBjYW4gYmUgaW5kZXBlbmRlbnQgb2YgdHJ5L2ZpbmFsbHkgYmxvY2tzLCB3aGljaCBjb250cmlidXRlcyB0byBzYXZpbmcgYWJvdXQgNDAlIG9mZiB0aGUgQ1BVXG4gICAgICAgIC8vIG92ZXJoZWFkIG9mIGNvbXB1dGVkIGV2YWx1YXRpb24gKG9uIFY4IGF0IGxlYXN0KS5cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHJlYWRGdW5jdGlvbiA9IHN0YXRlLnJlYWRGdW5jdGlvbjtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5ldmFsdWF0b3JGdW5jdGlvblRhcmdldCA/IHJlYWRGdW5jdGlvbi5jYWxsKHN0YXRlLmV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0KSA6IHJlYWRGdW5jdGlvbigpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5lbmQoKTtcblxuICAgICAgICAgICAgLy8gRm9yIGVhY2ggc3Vic2NyaXB0aW9uIG5vIGxvbmdlciBiZWluZyB1c2VkLCByZW1vdmUgaXQgZnJvbSB0aGUgYWN0aXZlIHN1YnNjcmlwdGlvbnMgbGlzdCBhbmQgZGlzcG9zZSBpdFxuICAgICAgICAgICAgaWYgKGRlcGVuZGVuY3lEZXRlY3Rpb25Db250ZXh0LmRpc3Bvc2FsQ291bnQgJiYgIXN0YXRlLmlzU2xlZXBpbmcpIHtcbiAgICAgICAgICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKGRlcGVuZGVuY3lEZXRlY3Rpb25Db250ZXh0LmRpc3Bvc2FsQ2FuZGlkYXRlcywgY29tcHV0ZWREaXNwb3NlRGVwZW5kZW5jeUNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RhdGUuaXNTdGFsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBwZWVrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFBlZWsgd29uJ3QgcmUtZXZhbHVhdGUsIGV4Y2VwdCB3aGlsZSB0aGUgY29tcHV0ZWQgaXMgc2xlZXBpbmcgb3IgdG8gZ2V0IHRoZSBpbml0aWFsIHZhbHVlIHdoZW4gXCJkZWZlckV2YWx1YXRpb25cIiBpcyBzZXQuXG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXNbY29tcHV0ZWRTdGF0ZV07XG4gICAgICAgIGlmICgoc3RhdGUuaXNTdGFsZSAmJiAhc3RhdGUuZGVwZW5kZW5jaWVzQ291bnQpIHx8IChzdGF0ZS5pc1NsZWVwaW5nICYmIHRoaXMuaGF2ZURlcGVuZGVuY2llc0NoYW5nZWQoKSkpIHtcbiAgICAgICAgICAgIHRoaXMuZXZhbHVhdGVJbW1lZGlhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RhdGUubGF0ZXN0VmFsdWU7XG4gICAgfSxcbiAgICBsaW1pdDogZnVuY3Rpb24gKGxpbWl0RnVuY3Rpb24pIHtcbiAgICAgICAgLy8gT3ZlcnJpZGUgdGhlIGxpbWl0IGZ1bmN0aW9uIHdpdGggb25lIHRoYXQgZGVsYXlzIGV2YWx1YXRpb24gYXMgd2VsbFxuICAgICAgICBrby5zdWJzY3JpYmFibGVbJ2ZuJ10ubGltaXQuY2FsbCh0aGlzLCBsaW1pdEZ1bmN0aW9uKTtcbiAgICAgICAgdGhpcy5fZXZhbERlbGF5ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9saW1pdEJlZm9yZUNoYW5nZSh0aGlzW2NvbXB1dGVkU3RhdGVdLmxhdGVzdFZhbHVlKTtcblxuICAgICAgICAgICAgdGhpc1tjb21wdXRlZFN0YXRlXS5pc1N0YWxlID0gdHJ1ZTsgLy8gTWFyayBhcyBkaXJ0eVxuXG4gICAgICAgICAgICAvLyBQYXNzIHRoZSBvYnNlcnZhYmxlIHRvIHRoZSBcImxpbWl0XCIgY29kZSwgd2hpY2ggd2lsbCBhY2Nlc3MgaXQgd2hlblxuICAgICAgICAgICAgLy8gaXQncyB0aW1lIHRvIGRvIHRoZSBub3RpZmljYXRpb24uXG4gICAgICAgICAgICB0aGlzLl9saW1pdENoYW5nZSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGlzcG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzW2NvbXB1dGVkU3RhdGVdO1xuICAgICAgICBpZiAoIXN0YXRlLmlzU2xlZXBpbmcgJiYgc3RhdGUuZGVwZW5kZW5jeVRyYWNraW5nKSB7XG4gICAgICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKHN0YXRlLmRlcGVuZGVuY3lUcmFja2luZywgZnVuY3Rpb24gKGlkLCBkZXBlbmRlbmN5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGRlcGVuZGVuY3kuZGlzcG9zZSlcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jeS5kaXNwb3NlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhdGUuZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkICYmIHN0YXRlLmRvbU5vZGVEaXNwb3NhbENhbGxiYWNrKSB7XG4gICAgICAgICAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwucmVtb3ZlRGlzcG9zZUNhbGxiYWNrKHN0YXRlLmRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZCwgc3RhdGUuZG9tTm9kZURpc3Bvc2FsQ2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlLmRlcGVuZGVuY3lUcmFja2luZyA9IG51bGw7XG4gICAgICAgIHN0YXRlLmRlcGVuZGVuY2llc0NvdW50ID0gMDtcbiAgICAgICAgc3RhdGUuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgICAgIHN0YXRlLmlzU3RhbGUgPSBmYWxzZTtcbiAgICAgICAgc3RhdGUuaXNTbGVlcGluZyA9IGZhbHNlO1xuICAgICAgICBzdGF0ZS5kaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQgPSBudWxsO1xuICAgIH1cbn07XG5cbnZhciBwdXJlQ29tcHV0ZWRPdmVycmlkZXMgPSB7XG4gICAgYmVmb3JlU3Vic2NyaXB0aW9uQWRkOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gSWYgYXNsZWVwLCB3YWtlIHVwIHRoZSBjb21wdXRlZCBieSBzdWJzY3JpYmluZyB0byBhbnkgZGVwZW5kZW5jaWVzLlxuICAgICAgICB2YXIgY29tcHV0ZWRPYnNlcnZhYmxlID0gdGhpcyxcbiAgICAgICAgICAgIHN0YXRlID0gY29tcHV0ZWRPYnNlcnZhYmxlW2NvbXB1dGVkU3RhdGVdO1xuICAgICAgICBpZiAoIXN0YXRlLmlzRGlzcG9zZWQgJiYgc3RhdGUuaXNTbGVlcGluZyAmJiBldmVudCA9PSAnY2hhbmdlJykge1xuICAgICAgICAgICAgc3RhdGUuaXNTbGVlcGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHN0YXRlLmlzU3RhbGUgfHwgY29tcHV0ZWRPYnNlcnZhYmxlLmhhdmVEZXBlbmRlbmNpZXNDaGFuZ2VkKCkpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5kZXBlbmRlbmN5VHJhY2tpbmcgPSBudWxsO1xuICAgICAgICAgICAgICAgIHN0YXRlLmRlcGVuZGVuY2llc0NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBzdGF0ZS5pc1N0YWxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcHV0ZWRPYnNlcnZhYmxlLmV2YWx1YXRlSW1tZWRpYXRlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlLnVwZGF0ZVZlcnNpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEZpcnN0IHB1dCB0aGUgZGVwZW5kZW5jaWVzIGluIG9yZGVyXG4gICAgICAgICAgICAgICAgdmFyIGRlcGVuZGVjaWVzT3JkZXIgPSBbXTtcbiAgICAgICAgICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKHN0YXRlLmRlcGVuZGVuY3lUcmFja2luZywgZnVuY3Rpb24gKGlkLCBkZXBlbmRlbmN5KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZGVjaWVzT3JkZXJbZGVwZW5kZW5jeS5fb3JkZXJdID0gaWQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gTmV4dCwgc3Vic2NyaWJlIHRvIGVhY2ggb25lXG4gICAgICAgICAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGRlcGVuZGVjaWVzT3JkZXIsIGZ1bmN0aW9uIChpZCwgb3JkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlcGVuZGVuY3kgPSBzdGF0ZS5kZXBlbmRlbmN5VHJhY2tpbmdbaWRdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uID0gY29tcHV0ZWRPYnNlcnZhYmxlLnN1YnNjcmliZVRvRGVwZW5kZW5jeShkZXBlbmRlbmN5Ll90YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24uX29yZGVyID0gb3JkZXI7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5fdmVyc2lvbiA9IGRlcGVuZGVuY3kuX3ZlcnNpb247XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmRlcGVuZGVuY3lUcmFja2luZ1tpZF0gPSBzdWJzY3JpcHRpb247XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXN0YXRlLmlzRGlzcG9zZWQpIHsgICAgIC8vIHRlc3Qgc2luY2UgZXZhbHVhdGluZyBjb3VsZCB0cmlnZ2VyIGRpc3Bvc2FsXG4gICAgICAgICAgICAgICAgY29tcHV0ZWRPYnNlcnZhYmxlW1wibm90aWZ5U3Vic2NyaWJlcnNcIl0oc3RhdGUubGF0ZXN0VmFsdWUsIFwiYXdha2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFmdGVyU3Vic2NyaXB0aW9uUmVtb3ZlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpc1tjb21wdXRlZFN0YXRlXTtcbiAgICAgICAgaWYgKCFzdGF0ZS5pc0Rpc3Bvc2VkICYmIGV2ZW50ID09ICdjaGFuZ2UnICYmICF0aGlzLmhhc1N1YnNjcmlwdGlvbnNGb3JFdmVudCgnY2hhbmdlJykpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2goc3RhdGUuZGVwZW5kZW5jeVRyYWNraW5nLCBmdW5jdGlvbiAoaWQsIGRlcGVuZGVuY3kpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVwZW5kZW5jeS5kaXNwb3NlKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLmRlcGVuZGVuY3lUcmFja2luZ1tpZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGFyZ2V0OiBkZXBlbmRlbmN5Ll90YXJnZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBfb3JkZXI6IGRlcGVuZGVuY3kuX29yZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgX3ZlcnNpb246IGRlcGVuZGVuY3kuX3ZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kZW5jeS5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdGF0ZS5pc1NsZWVwaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXNbXCJub3RpZnlTdWJzY3JpYmVyc1wiXSh1bmRlZmluZWQsIFwiYXNsZWVwXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRWZXJzaW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEJlY2F1c2UgYSBwdXJlIGNvbXB1dGVkIGlzIG5vdCBhdXRvbWF0aWNhbGx5IHVwZGF0ZWQgd2hpbGUgaXQgaXMgc2xlZXBpbmcsIHdlIGNhbid0XG4gICAgICAgIC8vIHNpbXBseSByZXR1cm4gdGhlIHZlcnNpb24gbnVtYmVyLiBJbnN0ZWFkLCB3ZSBjaGVjayBpZiBhbnkgb2YgdGhlIGRlcGVuZGVuY2llcyBoYXZlXG4gICAgICAgIC8vIGNoYW5nZWQgYW5kIGNvbmRpdGlvbmFsbHkgcmUtZXZhbHVhdGUgdGhlIGNvbXB1dGVkIG9ic2VydmFibGUuXG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXNbY29tcHV0ZWRTdGF0ZV07XG4gICAgICAgIGlmIChzdGF0ZS5pc1NsZWVwaW5nICYmIChzdGF0ZS5pc1N0YWxlIHx8IHRoaXMuaGF2ZURlcGVuZGVuY2llc0NoYW5nZWQoKSkpIHtcbiAgICAgICAgICAgIHRoaXMuZXZhbHVhdGVJbW1lZGlhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga28uc3Vic2NyaWJhYmxlWydmbiddLmdldFZlcnNpb24uY2FsbCh0aGlzKTtcbiAgICB9XG59O1xuXG52YXIgZGVmZXJFdmFsdWF0aW9uT3ZlcnJpZGVzID0ge1xuICAgIGJlZm9yZVN1YnNjcmlwdGlvbkFkZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCBmb3JjZSBhIGNvbXB1dGVkIHdpdGggZGVmZXJFdmFsdWF0aW9uIHRvIGV2YWx1YXRlIHdoZW4gdGhlIGZpcnN0IHN1YnNjcmlwdGlvbiBpcyByZWdpc3RlcmVkLlxuICAgICAgICBpZiAoZXZlbnQgPT0gJ2NoYW5nZScgfHwgZXZlbnQgPT0gJ2JlZm9yZUNoYW5nZScpIHtcbiAgICAgICAgICAgIHRoaXMucGVlaygpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gTm90ZSB0aGF0IGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgcHJvdG8gYXNzaWdubWVudCwgdGhlXG4vLyBpbmhlcml0YW5jZSBjaGFpbiBpcyBjcmVhdGVkIG1hbnVhbGx5IGluIHRoZSBrby5jb21wdXRlZCBjb25zdHJ1Y3RvclxuaWYgKGtvLnV0aWxzLmNhblNldFByb3RvdHlwZSkge1xuICAgIGtvLnV0aWxzLnNldFByb3RvdHlwZU9mKGNvbXB1dGVkRm4sIGtvLnN1YnNjcmliYWJsZVsnZm4nXSk7XG59XG5cbi8vIFNldCB0aGUgcHJvdG8gY2hhaW4gdmFsdWVzIGZvciBrby5oYXNQcm90b3R5cGVcbnZhciBwcm90b1Byb3AgPSBrby5vYnNlcnZhYmxlLnByb3RvUHJvcGVydHk7IC8vID09IFwiX19rb19wcm90b19fXCJcbmtvLmNvbXB1dGVkW3Byb3RvUHJvcF0gPSBrby5vYnNlcnZhYmxlO1xuY29tcHV0ZWRGbltwcm90b1Byb3BdID0ga28uY29tcHV0ZWQ7XG5cbmtvLmlzQ29tcHV0ZWQgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4ga28uaGFzUHJvdG90eXBlKGluc3RhbmNlLCBrby5jb21wdXRlZCk7XG59O1xuXG5rby5pc1B1cmVDb21wdXRlZCA9IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgIHJldHVybiBrby5oYXNQcm90b3R5cGUoaW5zdGFuY2UsIGtvLmNvbXB1dGVkKVxuICAgICAgICAmJiBpbnN0YW5jZVtjb21wdXRlZFN0YXRlXSAmJiBpbnN0YW5jZVtjb21wdXRlZFN0YXRlXS5wdXJlO1xufTtcblxua28uZXhwb3J0U3ltYm9sKCdjb21wdXRlZCcsIGtvLmNvbXB1dGVkKTtcbmtvLmV4cG9ydFN5bWJvbCgnZGVwZW5kZW50T2JzZXJ2YWJsZScsIGtvLmNvbXB1dGVkKTsgICAgLy8gZXhwb3J0IGtvLmRlcGVuZGVudE9ic2VydmFibGUgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5ICgxLngpXG5rby5leHBvcnRTeW1ib2woJ2lzQ29tcHV0ZWQnLCBrby5pc0NvbXB1dGVkKTtcbmtvLmV4cG9ydFN5bWJvbCgnaXNQdXJlQ29tcHV0ZWQnLCBrby5pc1B1cmVDb21wdXRlZCk7XG5rby5leHBvcnRTeW1ib2woJ2NvbXB1dGVkLmZuJywgY29tcHV0ZWRGbik7XG5rby5leHBvcnRQcm9wZXJ0eShjb21wdXRlZEZuLCAncGVlaycsIGNvbXB1dGVkRm4ucGVlayk7XG5rby5leHBvcnRQcm9wZXJ0eShjb21wdXRlZEZuLCAnZGlzcG9zZScsIGNvbXB1dGVkRm4uZGlzcG9zZSk7XG5rby5leHBvcnRQcm9wZXJ0eShjb21wdXRlZEZuLCAnaXNBY3RpdmUnLCBjb21wdXRlZEZuLmlzQWN0aXZlKTtcbmtvLmV4cG9ydFByb3BlcnR5KGNvbXB1dGVkRm4sICdnZXREZXBlbmRlbmNpZXNDb3VudCcsIGNvbXB1dGVkRm4uZ2V0RGVwZW5kZW5jaWVzQ291bnQpO1xuXG5rby5wdXJlQ29tcHV0ZWQgPSBmdW5jdGlvbiAoZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMsIGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0KSB7XG4gICAgaWYgKHR5cGVvZiBldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQoZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMsIGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0LCB7J3B1cmUnOnRydWV9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBldmFsdWF0b3JGdW5jdGlvbk9yT3B0aW9ucyA9IGtvLnV0aWxzLmV4dGVuZCh7fSwgZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMpOyAgIC8vIG1ha2UgYSBjb3B5IG9mIHRoZSBwYXJhbWV0ZXIgb2JqZWN0XG4gICAgICAgIGV2YWx1YXRvckZ1bmN0aW9uT3JPcHRpb25zWydwdXJlJ10gPSB0cnVlO1xuICAgICAgICByZXR1cm4ga28uY29tcHV0ZWQoZXZhbHVhdG9yRnVuY3Rpb25Pck9wdGlvbnMsIGV2YWx1YXRvckZ1bmN0aW9uVGFyZ2V0KTtcbiAgICB9XG59XG5rby5leHBvcnRTeW1ib2woJ3B1cmVDb21wdXRlZCcsIGtvLnB1cmVDb21wdXRlZCk7XG5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgbWF4TmVzdGVkT2JzZXJ2YWJsZURlcHRoID0gMTA7IC8vIEVzY2FwZSB0aGUgKHVubGlrZWx5KSBwYXRoYWxvZ2ljYWwgY2FzZSB3aGVyZSBhbiBvYnNlcnZhYmxlJ3MgY3VycmVudCB2YWx1ZSBpcyBpdHNlbGYgKG9yIHNpbWlsYXIgcmVmZXJlbmNlIGN5Y2xlKVxuXG4gICAga28udG9KUyA9IGZ1bmN0aW9uKHJvb3RPYmplY3QpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIldoZW4gY2FsbGluZyBrby50b0pTLCBwYXNzIHRoZSBvYmplY3QgeW91IHdhbnQgdG8gY29udmVydC5cIik7XG5cbiAgICAgICAgLy8gV2UganVzdCB1bndyYXAgZXZlcnl0aGluZyBhdCBldmVyeSBsZXZlbCBpbiB0aGUgb2JqZWN0IGdyYXBoXG4gICAgICAgIHJldHVybiBtYXBKc09iamVjdEdyYXBoKHJvb3RPYmplY3QsIGZ1bmN0aW9uKHZhbHVlVG9NYXApIHtcbiAgICAgICAgICAgIC8vIExvb3AgYmVjYXVzZSBhbiBvYnNlcnZhYmxlJ3MgdmFsdWUgbWlnaHQgaW4gdHVybiBiZSBhbm90aGVyIG9ic2VydmFibGUgd3JhcHBlclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGtvLmlzT2JzZXJ2YWJsZSh2YWx1ZVRvTWFwKSAmJiAoaSA8IG1heE5lc3RlZE9ic2VydmFibGVEZXB0aCk7IGkrKylcbiAgICAgICAgICAgICAgICB2YWx1ZVRvTWFwID0gdmFsdWVUb01hcCgpO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlVG9NYXA7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBrby50b0pTT04gPSBmdW5jdGlvbihyb290T2JqZWN0LCByZXBsYWNlciwgc3BhY2UpIHsgICAgIC8vIHJlcGxhY2VyIGFuZCBzcGFjZSBhcmUgb3B0aW9uYWxcbiAgICAgICAgdmFyIHBsYWluSmF2YVNjcmlwdE9iamVjdCA9IGtvLnRvSlMocm9vdE9iamVjdCk7XG4gICAgICAgIHJldHVybiBrby51dGlscy5zdHJpbmdpZnlKc29uKHBsYWluSmF2YVNjcmlwdE9iamVjdCwgcmVwbGFjZXIsIHNwYWNlKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbWFwSnNPYmplY3RHcmFwaChyb290T2JqZWN0LCBtYXBJbnB1dENhbGxiYWNrLCB2aXNpdGVkT2JqZWN0cykge1xuICAgICAgICB2aXNpdGVkT2JqZWN0cyA9IHZpc2l0ZWRPYmplY3RzIHx8IG5ldyBvYmplY3RMb29rdXAoKTtcblxuICAgICAgICByb290T2JqZWN0ID0gbWFwSW5wdXRDYWxsYmFjayhyb290T2JqZWN0KTtcbiAgICAgICAgdmFyIGNhbkhhdmVQcm9wZXJ0aWVzID0gKHR5cGVvZiByb290T2JqZWN0ID09IFwib2JqZWN0XCIpICYmIChyb290T2JqZWN0ICE9PSBudWxsKSAmJiAocm9vdE9iamVjdCAhPT0gdW5kZWZpbmVkKSAmJiAoIShyb290T2JqZWN0IGluc3RhbmNlb2YgUmVnRXhwKSkgJiYgKCEocm9vdE9iamVjdCBpbnN0YW5jZW9mIERhdGUpKSAmJiAoIShyb290T2JqZWN0IGluc3RhbmNlb2YgU3RyaW5nKSkgJiYgKCEocm9vdE9iamVjdCBpbnN0YW5jZW9mIE51bWJlcikpICYmICghKHJvb3RPYmplY3QgaW5zdGFuY2VvZiBCb29sZWFuKSk7XG4gICAgICAgIGlmICghY2FuSGF2ZVByb3BlcnRpZXMpXG4gICAgICAgICAgICByZXR1cm4gcm9vdE9iamVjdDtcblxuICAgICAgICB2YXIgb3V0cHV0UHJvcGVydGllcyA9IHJvb3RPYmplY3QgaW5zdGFuY2VvZiBBcnJheSA/IFtdIDoge307XG4gICAgICAgIHZpc2l0ZWRPYmplY3RzLnNhdmUocm9vdE9iamVjdCwgb3V0cHV0UHJvcGVydGllcyk7XG5cbiAgICAgICAgdmlzaXRQcm9wZXJ0aWVzT3JBcnJheUVudHJpZXMocm9vdE9iamVjdCwgZnVuY3Rpb24oaW5kZXhlcikge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWUgPSBtYXBJbnB1dENhbGxiYWNrKHJvb3RPYmplY3RbaW5kZXhlcl0pO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiBwcm9wZXJ0eVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgICAgICAgICAgICAgICBvdXRwdXRQcm9wZXJ0aWVzW2luZGV4ZXJdID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJ1bmRlZmluZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzbHlNYXBwZWRWYWx1ZSA9IHZpc2l0ZWRPYmplY3RzLmdldChwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0UHJvcGVydGllc1tpbmRleGVyXSA9IChwcmV2aW91c2x5TWFwcGVkVmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgID8gcHJldmlvdXNseU1hcHBlZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG1hcEpzT2JqZWN0R3JhcGgocHJvcGVydHlWYWx1ZSwgbWFwSW5wdXRDYWxsYmFjaywgdmlzaXRlZE9iamVjdHMpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dFByb3BlcnRpZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmlzaXRQcm9wZXJ0aWVzT3JBcnJheUVudHJpZXMocm9vdE9iamVjdCwgdmlzaXRvckNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChyb290T2JqZWN0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9vdE9iamVjdC5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICB2aXNpdG9yQ2FsbGJhY2soaSk7XG5cbiAgICAgICAgICAgIC8vIEZvciBhcnJheXMsIGFsc28gcmVzcGVjdCB0b0pTT04gcHJvcGVydHkgZm9yIGN1c3RvbSBtYXBwaW5ncyAoZml4ZXMgIzI3OClcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE9iamVjdFsndG9KU09OJ10gPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICB2aXNpdG9yQ2FsbGJhY2soJ3RvSlNPTicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHJvb3RPYmplY3QpIHtcbiAgICAgICAgICAgICAgICB2aXNpdG9yQ2FsbGJhY2socHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBvYmplY3RMb29rdXAoKSB7XG4gICAgICAgIHRoaXMua2V5cyA9IFtdO1xuICAgICAgICB0aGlzLnZhbHVlcyA9IFtdO1xuICAgIH07XG5cbiAgICBvYmplY3RMb29rdXAucHJvdG90eXBlID0ge1xuICAgICAgICBjb25zdHJ1Y3Rvcjogb2JqZWN0TG9va3VwLFxuICAgICAgICBzYXZlOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgZXhpc3RpbmdJbmRleCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZih0aGlzLmtleXMsIGtleSk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdJbmRleCA+PSAwKVxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzW2V4aXN0aW5nSW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtleXMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgdmFyIGV4aXN0aW5nSW5kZXggPSBrby51dGlscy5hcnJheUluZGV4T2YodGhpcy5rZXlzLCBrZXkpO1xuICAgICAgICAgICAgcmV0dXJuIChleGlzdGluZ0luZGV4ID49IDApID8gdGhpcy52YWx1ZXNbZXhpc3RpbmdJbmRleF0gOiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCd0b0pTJywga28udG9KUyk7XG5rby5leHBvcnRTeW1ib2woJ3RvSlNPTicsIGtvLnRvSlNPTik7XG4oZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYXNEb21EYXRhRXhwYW5kb1Byb3BlcnR5ID0gJ19fa29fX2hhc0RvbURhdGFPcHRpb25WYWx1ZV9fJztcblxuICAgIC8vIE5vcm1hbGx5LCBTRUxFQ1QgZWxlbWVudHMgYW5kIHRoZWlyIE9QVElPTnMgY2FuIG9ubHkgdGFrZSB2YWx1ZSBvZiB0eXBlICdzdHJpbmcnIChiZWNhdXNlIHRoZSB2YWx1ZXNcbiAgICAvLyBhcmUgc3RvcmVkIG9uIERPTSBhdHRyaWJ1dGVzKS4ga28uc2VsZWN0RXh0ZW5zaW9ucyBwcm92aWRlcyBhIHdheSBmb3IgU0VMRUNUcy9PUFRJT05zIHRvIGhhdmUgdmFsdWVzXG4gICAgLy8gdGhhdCBhcmUgYXJiaXRyYXJ5IG9iamVjdHMuIFRoaXMgaXMgdmVyeSBjb252ZW5pZW50IHdoZW4gaW1wbGVtZW50aW5nIHRoaW5ncyBsaWtlIGNhc2NhZGluZyBkcm9wZG93bnMuXG4gICAga28uc2VsZWN0RXh0ZW5zaW9ucyA9IHtcbiAgICAgICAgcmVhZFZhbHVlIDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgc3dpdGNoIChrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdvcHRpb24nOlxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudFtoYXNEb21EYXRhRXhwYW5kb1Byb3BlcnR5XSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy5kb21EYXRhLmdldChlbGVtZW50LCBrby5iaW5kaW5nSGFuZGxlcnMub3B0aW9ucy5vcHRpb25WYWx1ZURvbURhdGFLZXkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMuaWVWZXJzaW9uIDw9IDdcbiAgICAgICAgICAgICAgICAgICAgICAgID8gKGVsZW1lbnQuZ2V0QXR0cmlidXRlTm9kZSgndmFsdWUnKSAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZU5vZGUoJ3ZhbHVlJykuc3BlY2lmaWVkID8gZWxlbWVudC52YWx1ZSA6IGVsZW1lbnQudGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgIDogZWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5zZWxlY3RlZEluZGV4ID49IDAgPyBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50Lm9wdGlvbnNbZWxlbWVudC5zZWxlY3RlZEluZGV4XSkgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgd3JpdGVWYWx1ZTogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWUsIGFsbG93VW5zZXQpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoa28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnb3B0aW9uJzpcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KGVsZW1lbnQsIGtvLmJpbmRpbmdIYW5kbGVycy5vcHRpb25zLm9wdGlvblZhbHVlRG9tRGF0YUtleSwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzRG9tRGF0YUV4cGFuZG9Qcm9wZXJ0eSBpbiBlbGVtZW50KSB7IC8vIElFIDw9IDggdGhyb3dzIGVycm9ycyBpZiB5b3UgZGVsZXRlIG5vbi1leGlzdGVudCBwcm9wZXJ0aWVzIGZyb20gYSBET00gbm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZWxlbWVudFtoYXNEb21EYXRhRXhwYW5kb1Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTdG9yZSBhcmJpdHJhcnkgb2JqZWN0IHVzaW5nIERvbURhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChlbGVtZW50LCBrby5iaW5kaW5nSGFuZGxlcnMub3B0aW9ucy5vcHRpb25WYWx1ZURvbURhdGFLZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50W2hhc0RvbURhdGFFeHBhbmRvUHJvcGVydHldID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNwZWNpYWwgdHJlYXRtZW50IG9mIG51bWJlcnMgaXMganVzdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eS4gS08gMS4yLjEgd3JvdGUgbnVtZXJpY2FsIHZhbHVlcyB0byBlbGVtZW50LnZhbHVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgPyB2YWx1ZSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBcIlwiIHx8IHZhbHVlID09PSBudWxsKSAgICAgICAvLyBBIGJsYW5rIHN0cmluZyBvciBudWxsIHZhbHVlIHdpbGwgc2VsZWN0IHRoZSBjYXB0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGlvbiA9IC0xO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbiA9IGVsZW1lbnQub3B0aW9ucy5sZW5ndGgsIG9wdGlvblZhbHVlOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25WYWx1ZSA9IGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQub3B0aW9uc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJbmNsdWRlIHNwZWNpYWwgY2hlY2sgdG8gaGFuZGxlIHNlbGVjdGluZyBhIGNhcHRpb24gd2l0aCBhIGJsYW5rIHN0cmluZyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvblZhbHVlID09IHZhbHVlIHx8IChvcHRpb25WYWx1ZSA9PSBcIlwiICYmIHZhbHVlID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYWxsb3dVbnNldCB8fCBzZWxlY3Rpb24gPj0gMCB8fCAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiBlbGVtZW50LnNpemUgPiAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZWxlY3RlZEluZGV4ID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICgodmFsdWUgPT09IG51bGwpIHx8ICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59KSgpO1xuXG5rby5leHBvcnRTeW1ib2woJ3NlbGVjdEV4dGVuc2lvbnMnLCBrby5zZWxlY3RFeHRlbnNpb25zKTtcbmtvLmV4cG9ydFN5bWJvbCgnc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUnLCBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZSk7XG5rby5leHBvcnRTeW1ib2woJ3NlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZScsIGtvLnNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZSk7XG5rby5leHByZXNzaW9uUmV3cml0aW5nID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgamF2YVNjcmlwdFJlc2VydmVkV29yZHMgPSBbXCJ0cnVlXCIsIFwiZmFsc2VcIiwgXCJudWxsXCIsIFwidW5kZWZpbmVkXCJdO1xuXG4gICAgLy8gTWF0Y2hlcyBzb21ldGhpbmcgdGhhdCBjYW4gYmUgYXNzaWduZWQgdG8tLWVpdGhlciBhbiBpc29sYXRlZCBpZGVudGlmaWVyIG9yIHNvbWV0aGluZyBlbmRpbmcgd2l0aCBhIHByb3BlcnR5IGFjY2Vzc29yXG4gICAgLy8gVGhpcyBpcyBkZXNpZ25lZCB0byBiZSBzaW1wbGUgYW5kIGF2b2lkIGZhbHNlIG5lZ2F0aXZlcywgYnV0IGNvdWxkIHByb2R1Y2UgZmFsc2UgcG9zaXRpdmVzIChlLmcuLCBhK2IuYykuXG4gICAgLy8gVGhpcyBhbHNvIHdpbGwgbm90IHByb3Blcmx5IGhhbmRsZSBuZXN0ZWQgYnJhY2tldHMgKGUuZy4sIG9iajFbb2JqMlsncHJvcCddXTsgc2VlICM5MTEpLlxuICAgIHZhciBqYXZhU2NyaXB0QXNzaWdubWVudFRhcmdldCA9IC9eKD86WyRfYS16XVskXFx3XSp8KC4rKShcXC5cXHMqWyRfYS16XVskXFx3XSp8XFxbLitcXF0pKSQvaTtcblxuICAgIGZ1bmN0aW9uIGdldFdyaXRlYWJsZVZhbHVlKGV4cHJlc3Npb24pIHtcbiAgICAgICAgaWYgKGtvLnV0aWxzLmFycmF5SW5kZXhPZihqYXZhU2NyaXB0UmVzZXJ2ZWRXb3JkcywgZXhwcmVzc2lvbikgPj0gMClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIG1hdGNoID0gZXhwcmVzc2lvbi5tYXRjaChqYXZhU2NyaXB0QXNzaWdubWVudFRhcmdldCk7XG4gICAgICAgIHJldHVybiBtYXRjaCA9PT0gbnVsbCA/IGZhbHNlIDogbWF0Y2hbMV0gPyAoJ09iamVjdCgnICsgbWF0Y2hbMV0gKyAnKScgKyBtYXRjaFsyXSkgOiBleHByZXNzaW9uO1xuICAgIH1cblxuICAgIC8vIFRoZSBmb2xsb3dpbmcgcmVndWxhciBleHByZXNzaW9ucyB3aWxsIGJlIHVzZWQgdG8gc3BsaXQgYW4gb2JqZWN0LWxpdGVyYWwgc3RyaW5nIGludG8gdG9rZW5zXG5cbiAgICAgICAgLy8gVGhlc2UgdHdvIG1hdGNoIHN0cmluZ3MsIGVpdGhlciB3aXRoIGRvdWJsZSBxdW90ZXMgb3Igc2luZ2xlIHF1b3Rlc1xuICAgIHZhciBzdHJpbmdEb3VibGUgPSAnXCIoPzpbXlwiXFxcXFxcXFxdfFxcXFxcXFxcLikqXCInLFxuICAgICAgICBzdHJpbmdTaW5nbGUgPSBcIicoPzpbXidcXFxcXFxcXF18XFxcXFxcXFwuKSonXCIsXG4gICAgICAgIC8vIE1hdGNoZXMgYSByZWd1bGFyIGV4cHJlc3Npb24gKHRleHQgZW5jbG9zZWQgYnkgc2xhc2hlcyksIGJ1dCB3aWxsIGFsc28gbWF0Y2ggc2V0cyBvZiBkaXZpc2lvbnNcbiAgICAgICAgLy8gYXMgYSByZWd1bGFyIGV4cHJlc3Npb24gKHRoaXMgaXMgaGFuZGxlZCBieSB0aGUgcGFyc2luZyBsb29wIGJlbG93KS5cbiAgICAgICAgc3RyaW5nUmVnZXhwID0gJy8oPzpbXi9cXFxcXFxcXF18XFxcXFxcXFwuKSovXFx3KicsXG4gICAgICAgIC8vIFRoZXNlIGNoYXJhY3RlcnMgaGF2ZSBzcGVjaWFsIG1lYW5pbmcgdG8gdGhlIHBhcnNlciBhbmQgbXVzdCBub3QgYXBwZWFyIGluIHRoZSBtaWRkbGUgb2YgYVxuICAgICAgICAvLyB0b2tlbiwgZXhjZXB0IGFzIHBhcnQgb2YgYSBzdHJpbmcuXG4gICAgICAgIHNwZWNpYWxzID0gJyxcIlxcJ3t9KCkvOltcXFxcXScsXG4gICAgICAgIC8vIE1hdGNoIHRleHQgKGF0IGxlYXN0IHR3byBjaGFyYWN0ZXJzKSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gYW55IG9mIHRoZSBhYm92ZSBzcGVjaWFsIGNoYXJhY3RlcnMsXG4gICAgICAgIC8vIGFsdGhvdWdoIHNvbWUgb2YgdGhlIHNwZWNpYWwgY2hhcmFjdGVycyBhcmUgYWxsb3dlZCB0byBzdGFydCBpdCAoYWxsIGJ1dCB0aGUgY29sb24gYW5kIGNvbW1hKS5cbiAgICAgICAgLy8gVGhlIHRleHQgY2FuIGNvbnRhaW4gc3BhY2VzLCBidXQgbGVhZGluZyBvciB0cmFpbGluZyBzcGFjZXMgYXJlIHNraXBwZWQuXG4gICAgICAgIGV2ZXJ5VGhpbmdFbHNlID0gJ1teXFxcXHM6LC9dW14nICsgc3BlY2lhbHMgKyAnXSpbXlxcXFxzJyArIHNwZWNpYWxzICsgJ10nLFxuICAgICAgICAvLyBNYXRjaCBhbnkgbm9uLXNwYWNlIGNoYXJhY3RlciBub3QgbWF0Y2hlZCBhbHJlYWR5LiBUaGlzIHdpbGwgbWF0Y2ggY29sb25zIGFuZCBjb21tYXMsIHNpbmNlIHRoZXkncmVcbiAgICAgICAgLy8gbm90IG1hdGNoZWQgYnkgXCJldmVyeVRoaW5nRWxzZVwiLCBidXQgd2lsbCBhbHNvIG1hdGNoIGFueSBvdGhlciBzaW5nbGUgY2hhcmFjdGVyIHRoYXQgd2Fzbid0IGFscmVhZHlcbiAgICAgICAgLy8gbWF0Y2hlZCAoZm9yIGV4YW1wbGU6IGluIFwiYTogMSwgYjogMlwiLCBlYWNoIG9mIHRoZSBub24tc3BhY2UgY2hhcmFjdGVycyB3aWxsIGJlIG1hdGNoZWQgYnkgb25lTm90U3BhY2UpLlxuICAgICAgICBvbmVOb3RTcGFjZSA9ICdbXlxcXFxzXScsXG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBhY3R1YWwgcmVndWxhciBleHByZXNzaW9uIGJ5IG9yLWluZyB0aGUgYWJvdmUgc3RyaW5ncy4gVGhlIG9yZGVyIGlzIGltcG9ydGFudC5cbiAgICAgICAgYmluZGluZ1Rva2VuID0gUmVnRXhwKHN0cmluZ0RvdWJsZSArICd8JyArIHN0cmluZ1NpbmdsZSArICd8JyArIHN0cmluZ1JlZ2V4cCArICd8JyArIGV2ZXJ5VGhpbmdFbHNlICsgJ3wnICsgb25lTm90U3BhY2UsICdnJyksXG5cbiAgICAgICAgLy8gTWF0Y2ggZW5kIG9mIHByZXZpb3VzIHRva2VuIHRvIGRldGVybWluZSB3aGV0aGVyIGEgc2xhc2ggaXMgYSBkaXZpc2lvbiBvciByZWdleC5cbiAgICAgICAgZGl2aXNpb25Mb29rQmVoaW5kID0gL1tcXF0pXCInQS1aYS16MC05XyRdKyQvLFxuICAgICAgICBrZXl3b3JkUmVnZXhMb29rQmVoaW5kID0geydpbic6MSwncmV0dXJuJzoxLCd0eXBlb2YnOjF9O1xuXG4gICAgZnVuY3Rpb24gcGFyc2VPYmplY3RMaXRlcmFsKG9iamVjdExpdGVyYWxTdHJpbmcpIHtcbiAgICAgICAgLy8gVHJpbSBsZWFkaW5nIGFuZCB0cmFpbGluZyBzcGFjZXMgZnJvbSB0aGUgc3RyaW5nXG4gICAgICAgIHZhciBzdHIgPSBrby51dGlscy5zdHJpbmdUcmltKG9iamVjdExpdGVyYWxTdHJpbmcpO1xuXG4gICAgICAgIC8vIFRyaW0gYnJhY2VzICd7JyBzdXJyb3VuZGluZyB0aGUgd2hvbGUgb2JqZWN0IGxpdGVyYWxcbiAgICAgICAgaWYgKHN0ci5jaGFyQ29kZUF0KDApID09PSAxMjMpIHN0ciA9IHN0ci5zbGljZSgxLCAtMSk7XG5cbiAgICAgICAgLy8gU3BsaXQgaW50byB0b2tlbnNcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdLCB0b2tzID0gc3RyLm1hdGNoKGJpbmRpbmdUb2tlbiksIGtleSwgdmFsdWVzID0gW10sIGRlcHRoID0gMDtcblxuICAgICAgICBpZiAodG9rcykge1xuICAgICAgICAgICAgLy8gQXBwZW5kIGEgY29tbWEgc28gdGhhdCB3ZSBkb24ndCBuZWVkIGEgc2VwYXJhdGUgY29kZSBibG9jayB0byBkZWFsIHdpdGggdGhlIGxhc3QgaXRlbVxuICAgICAgICAgICAgdG9rcy5wdXNoKCcsJyk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCB0b2s7IHRvayA9IHRva3NbaV07ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBjID0gdG9rLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICAgICAgLy8gQSBjb21tYSBzaWduYWxzIHRoZSBlbmQgb2YgYSBrZXkvdmFsdWUgcGFpciBpZiBkZXB0aCBpcyB6ZXJvXG4gICAgICAgICAgICAgICAgaWYgKGMgPT09IDQ0KSB7IC8vIFwiLFwiXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXB0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCgoa2V5ICYmIHZhbHVlcy5sZW5ndGgpID8ge2tleToga2V5LCB2YWx1ZTogdmFsdWVzLmpvaW4oJycpfSA6IHsndW5rbm93bic6IGtleSB8fCB2YWx1ZXMuam9pbignJyl9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGRlcHRoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBTaW1wbHkgc2tpcCB0aGUgY29sb24gdGhhdCBzZXBhcmF0ZXMgdGhlIG5hbWUgYW5kIHZhbHVlXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjID09PSA1OCkgeyAvLyBcIjpcIlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWRlcHRoICYmICFrZXkgJiYgdmFsdWVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gdmFsdWVzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBBIHNldCBvZiBzbGFzaGVzIGlzIGluaXRpYWxseSBtYXRjaGVkIGFzIGEgcmVndWxhciBleHByZXNzaW9uLCBidXQgY291bGQgYmUgZGl2aXNpb25cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDQ3ICYmIGkgJiYgdG9rLmxlbmd0aCA+IDEpIHsgIC8vIFwiL1wiXG4gICAgICAgICAgICAgICAgICAgIC8vIExvb2sgYXQgdGhlIGVuZCBvZiB0aGUgcHJldmlvdXMgdG9rZW4gdG8gZGV0ZXJtaW5lIGlmIHRoZSBzbGFzaCBpcyBhY3R1YWxseSBkaXZpc2lvblxuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSB0b2tzW2ktMV0ubWF0Y2goZGl2aXNpb25Mb29rQmVoaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoICYmICFrZXl3b3JkUmVnZXhMb29rQmVoaW5kW21hdGNoWzBdXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHNsYXNoIGlzIGFjdHVhbGx5IGEgZGl2aXNpb24gcHVuY3R1YXRvcjsgcmUtcGFyc2UgdGhlIHJlbWFpbmRlciBvZiB0aGUgc3RyaW5nIChub3QgaW5jbHVkaW5nIHRoZSBzbGFzaClcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoc3RyLmluZGV4T2YodG9rKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rcyA9IHN0ci5tYXRjaChiaW5kaW5nVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9rcy5wdXNoKCcsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb250aW51ZSB3aXRoIGp1c3QgdGhlIHNsYXNoXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2sgPSAnLyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJbmNyZW1lbnQgZGVwdGggZm9yIHBhcmVudGhlc2VzLCBicmFjZXMsIGFuZCBicmFja2V0cyBzbyB0aGF0IGludGVyaW9yIGNvbW1hcyBhcmUgaWdub3JlZFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gNDAgfHwgYyA9PT0gMTIzIHx8IGMgPT09IDkxKSB7IC8vICcoJywgJ3snLCAnWydcbiAgICAgICAgICAgICAgICAgICAgKytkZXB0aDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09IDQxIHx8IGMgPT09IDEyNSB8fCBjID09PSA5MykgeyAvLyAnKScsICd9JywgJ10nXG4gICAgICAgICAgICAgICAgICAgIC0tZGVwdGg7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGtleSB3aWxsIGJlIHRoZSBmaXJzdCB0b2tlbjsgaWYgaXQncyBhIHN0cmluZywgdHJpbSB0aGUgcXVvdGVzXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgha2V5ICYmICF2YWx1ZXMubGVuZ3RoICYmIChjID09PSAzNCB8fCBjID09PSAzOSkpIHsgLy8gJ1wiJywgXCInXCJcbiAgICAgICAgICAgICAgICAgICAgdG9rID0gdG9rLnNsaWNlKDEsIC0xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2godG9rKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vIFR3by13YXkgYmluZGluZ3MgaW5jbHVkZSBhIHdyaXRlIGZ1bmN0aW9uIHRoYXQgYWxsb3cgdGhlIGhhbmRsZXIgdG8gdXBkYXRlIHRoZSB2YWx1ZSBldmVuIGlmIGl0J3Mgbm90IGFuIG9ic2VydmFibGUuXG4gICAgdmFyIHR3b1dheUJpbmRpbmdzID0ge307XG5cbiAgICBmdW5jdGlvbiBwcmVQcm9jZXNzQmluZGluZ3MoYmluZGluZ3NTdHJpbmdPcktleVZhbHVlQXJyYXksIGJpbmRpbmdPcHRpb25zKSB7XG4gICAgICAgIGJpbmRpbmdPcHRpb25zID0gYmluZGluZ09wdGlvbnMgfHwge307XG5cbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc0tleVZhbHVlKGtleSwgdmFsKSB7XG4gICAgICAgICAgICB2YXIgd3JpdGFibGVWYWw7XG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxsUHJlcHJvY2Vzc0hvb2sob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChvYmogJiYgb2JqWydwcmVwcm9jZXNzJ10pID8gKHZhbCA9IG9ialsncHJlcHJvY2VzcyddKHZhbCwga2V5LCBwcm9jZXNzS2V5VmFsdWUpKSA6IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWJpbmRpbmdQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNhbGxQcmVwcm9jZXNzSG9vayhrb1snZ2V0QmluZGluZ0hhbmRsZXInXShrZXkpKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR3b1dheUJpbmRpbmdzW2tleV0gJiYgKHdyaXRhYmxlVmFsID0gZ2V0V3JpdGVhYmxlVmFsdWUodmFsKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIHR3by13YXkgYmluZGluZ3MsIHByb3ZpZGUgYSB3cml0ZSBtZXRob2QgaW4gY2FzZSB0aGUgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgLy8gaXNuJ3QgYSB3cml0YWJsZSBvYnNlcnZhYmxlLlxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eUFjY2Vzc29yUmVzdWx0U3RyaW5ncy5wdXNoKFwiJ1wiICsga2V5ICsgXCInOmZ1bmN0aW9uKF96KXtcIiArIHdyaXRhYmxlVmFsICsgXCI9X3p9XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFZhbHVlcyBhcmUgd3JhcHBlZCBpbiBhIGZ1bmN0aW9uIHNvIHRoYXQgZWFjaCB2YWx1ZSBjYW4gYmUgYWNjZXNzZWQgaW5kZXBlbmRlbnRseVxuICAgICAgICAgICAgaWYgKG1ha2VWYWx1ZUFjY2Vzc29ycykge1xuICAgICAgICAgICAgICAgIHZhbCA9ICdmdW5jdGlvbigpe3JldHVybiAnICsgdmFsICsgJyB9JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdFN0cmluZ3MucHVzaChcIidcIiArIGtleSArIFwiJzpcIiArIHZhbCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVzdWx0U3RyaW5ncyA9IFtdLFxuICAgICAgICAgICAgcHJvcGVydHlBY2Nlc3NvclJlc3VsdFN0cmluZ3MgPSBbXSxcbiAgICAgICAgICAgIG1ha2VWYWx1ZUFjY2Vzc29ycyA9IGJpbmRpbmdPcHRpb25zWyd2YWx1ZUFjY2Vzc29ycyddLFxuICAgICAgICAgICAgYmluZGluZ1BhcmFtcyA9IGJpbmRpbmdPcHRpb25zWydiaW5kaW5nUGFyYW1zJ10sXG4gICAgICAgICAgICBrZXlWYWx1ZUFycmF5ID0gdHlwZW9mIGJpbmRpbmdzU3RyaW5nT3JLZXlWYWx1ZUFycmF5ID09PSBcInN0cmluZ1wiID9cbiAgICAgICAgICAgICAgICBwYXJzZU9iamVjdExpdGVyYWwoYmluZGluZ3NTdHJpbmdPcktleVZhbHVlQXJyYXkpIDogYmluZGluZ3NTdHJpbmdPcktleVZhbHVlQXJyYXk7XG5cbiAgICAgICAga28udXRpbHMuYXJyYXlGb3JFYWNoKGtleVZhbHVlQXJyYXksIGZ1bmN0aW9uKGtleVZhbHVlKSB7XG4gICAgICAgICAgICBwcm9jZXNzS2V5VmFsdWUoa2V5VmFsdWUua2V5IHx8IGtleVZhbHVlWyd1bmtub3duJ10sIGtleVZhbHVlLnZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHByb3BlcnR5QWNjZXNzb3JSZXN1bHRTdHJpbmdzLmxlbmd0aClcbiAgICAgICAgICAgIHByb2Nlc3NLZXlWYWx1ZSgnX2tvX3Byb3BlcnR5X3dyaXRlcnMnLCBcIntcIiArIHByb3BlcnR5QWNjZXNzb3JSZXN1bHRTdHJpbmdzLmpvaW4oXCIsXCIpICsgXCIgfVwiKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0U3RyaW5ncy5qb2luKFwiLFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBiaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnM6IFtdLFxuXG4gICAgICAgIHR3b1dheUJpbmRpbmdzOiB0d29XYXlCaW5kaW5ncyxcblxuICAgICAgICBwYXJzZU9iamVjdExpdGVyYWw6IHBhcnNlT2JqZWN0TGl0ZXJhbCxcblxuICAgICAgICBwcmVQcm9jZXNzQmluZGluZ3M6IHByZVByb2Nlc3NCaW5kaW5ncyxcblxuICAgICAgICBrZXlWYWx1ZUFycmF5Q29udGFpbnNLZXk6IGZ1bmN0aW9uKGtleVZhbHVlQXJyYXksIGtleSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlWYWx1ZUFycmF5Lmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgIGlmIChrZXlWYWx1ZUFycmF5W2ldWydrZXknXSA9PSBrZXkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEludGVybmFsLCBwcml2YXRlIEtPIHV0aWxpdHkgZm9yIHVwZGF0aW5nIG1vZGVsIHByb3BlcnRpZXMgZnJvbSB3aXRoaW4gYmluZGluZ3NcbiAgICAgICAgLy8gcHJvcGVydHk6ICAgICAgICAgICAgSWYgdGhlIHByb3BlcnR5IGJlaW5nIHVwZGF0ZWQgaXMgKG9yIG1pZ2h0IGJlKSBhbiBvYnNlcnZhYmxlLCBwYXNzIGl0IGhlcmVcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgSWYgaXQgdHVybnMgb3V0IHRvIGJlIGEgd3JpdGFibGUgb2JzZXJ2YWJsZSwgaXQgd2lsbCBiZSB3cml0dGVuIHRvIGRpcmVjdGx5XG4gICAgICAgIC8vIGFsbEJpbmRpbmdzOiAgICAgICAgIEFuIG9iamVjdCB3aXRoIGEgZ2V0IG1ldGhvZCB0byByZXRyaWV2ZSBiaW5kaW5ncyBpbiB0aGUgY3VycmVudCBleGVjdXRpb24gY29udGV4dC5cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgVGhpcyB3aWxsIGJlIHNlYXJjaGVkIGZvciBhICdfa29fcHJvcGVydHlfd3JpdGVycycgcHJvcGVydHkgaW4gY2FzZSB5b3UncmUgd3JpdGluZyB0byBhIG5vbi1vYnNlcnZhYmxlXG4gICAgICAgIC8vIGtleTogICAgICAgICAgICAgICAgIFRoZSBrZXkgaWRlbnRpZnlpbmcgdGhlIHByb3BlcnR5IHRvIGJlIHdyaXR0ZW4uIEV4YW1wbGU6IGZvciB7IGhhc0ZvY3VzOiBteVZhbHVlIH0sIHdyaXRlIHRvICdteVZhbHVlJyBieSBzcGVjaWZ5aW5nIHRoZSBrZXkgJ2hhc0ZvY3VzJ1xuICAgICAgICAvLyB2YWx1ZTogICAgICAgICAgICAgICBUaGUgdmFsdWUgdG8gYmUgd3JpdHRlblxuICAgICAgICAvLyBjaGVja0lmRGlmZmVyZW50OiAgICBJZiB0cnVlLCBhbmQgaWYgdGhlIHByb3BlcnR5IGJlaW5nIHdyaXR0ZW4gaXMgYSB3cml0YWJsZSBvYnNlcnZhYmxlLCB0aGUgdmFsdWUgd2lsbCBvbmx5IGJlIHdyaXR0ZW4gaWZcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgaXQgaXMgIT09IGV4aXN0aW5nIHZhbHVlIG9uIHRoYXQgd3JpdGFibGUgb2JzZXJ2YWJsZVxuICAgICAgICB3cml0ZVZhbHVlVG9Qcm9wZXJ0eTogZnVuY3Rpb24ocHJvcGVydHksIGFsbEJpbmRpbmdzLCBrZXksIHZhbHVlLCBjaGVja0lmRGlmZmVyZW50KSB7XG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5IHx8ICFrby5pc09ic2VydmFibGUocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb3BXcml0ZXJzID0gYWxsQmluZGluZ3MuZ2V0KCdfa29fcHJvcGVydHlfd3JpdGVycycpO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wV3JpdGVycyAmJiBwcm9wV3JpdGVyc1trZXldKVxuICAgICAgICAgICAgICAgICAgICBwcm9wV3JpdGVyc1trZXldKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa28uaXNXcml0ZWFibGVPYnNlcnZhYmxlKHByb3BlcnR5KSAmJiAoIWNoZWNrSWZEaWZmZXJlbnQgfHwgcHJvcGVydHkucGVlaygpICE9PSB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCdleHByZXNzaW9uUmV3cml0aW5nJywga28uZXhwcmVzc2lvblJld3JpdGluZyk7XG5rby5leHBvcnRTeW1ib2woJ2V4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzJywga28uZXhwcmVzc2lvblJld3JpdGluZy5iaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnMpO1xua28uZXhwb3J0U3ltYm9sKCdleHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbCcsIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucGFyc2VPYmplY3RMaXRlcmFsKTtcbmtvLmV4cG9ydFN5bWJvbCgnZXhwcmVzc2lvblJld3JpdGluZy5wcmVQcm9jZXNzQmluZGluZ3MnLCBrby5leHByZXNzaW9uUmV3cml0aW5nLnByZVByb2Nlc3NCaW5kaW5ncyk7XG5cbi8vIE1ha2luZyBiaW5kaW5ncyBleHBsaWNpdGx5IGRlY2xhcmUgdGhlbXNlbHZlcyBhcyBcInR3byB3YXlcIiBpc24ndCBpZGVhbCBpbiB0aGUgbG9uZyB0ZXJtIChpdCB3b3VsZCBiZSBiZXR0ZXIgaWZcbi8vIGFsbCBiaW5kaW5ncyBjb3VsZCB1c2UgYW4gb2ZmaWNpYWwgJ3Byb3BlcnR5IHdyaXRlcicgQVBJIHdpdGhvdXQgbmVlZGluZyB0byBkZWNsYXJlIHRoYXQgdGhleSBtaWdodCkuIEhvd2V2ZXIsXG4vLyBzaW5jZSB0aGlzIGlzIG5vdCwgYW5kIGhhcyBuZXZlciBiZWVuLCBhIHB1YmxpYyBBUEkgKF9rb19wcm9wZXJ0eV93cml0ZXJzIHdhcyBuZXZlciBkb2N1bWVudGVkKSwgaXQncyBhY2NlcHRhYmxlXG4vLyBhcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgaW4gdGhlIHNob3J0IHRlcm0uXG4vLyBGb3IgdGhvc2UgZGV2ZWxvcGVycyB3aG8gcmVseSBvbiBfa29fcHJvcGVydHlfd3JpdGVycyBpbiB0aGVpciBjdXN0b20gYmluZGluZ3MsIHdlIGV4cG9zZSBfdHdvV2F5QmluZGluZ3MgYXMgYW5cbi8vIHVuZG9jdW1lbnRlZCBmZWF0dXJlIHRoYXQgbWFrZXMgaXQgcmVsYXRpdmVseSBlYXN5IHRvIHVwZ3JhZGUgdG8gS08gMy4wLiBIb3dldmVyLCB0aGlzIGlzIHN0aWxsIG5vdCBhbiBvZmZpY2lhbFxuLy8gcHVibGljIEFQSSwgYW5kIHdlIHJlc2VydmUgdGhlIHJpZ2h0IHRvIHJlbW92ZSBpdCBhdCBhbnkgdGltZSBpZiB3ZSBjcmVhdGUgYSByZWFsIHB1YmxpYyBwcm9wZXJ0eSB3cml0ZXJzIEFQSS5cbmtvLmV4cG9ydFN5bWJvbCgnZXhwcmVzc2lvblJld3JpdGluZy5fdHdvV2F5QmluZGluZ3MnLCBrby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzKTtcblxuLy8gRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHksIGRlZmluZSB0aGUgZm9sbG93aW5nIGFsaWFzZXMuIChQcmV2aW91c2x5LCB0aGVzZSBmdW5jdGlvbiBuYW1lcyB3ZXJlIG1pc2xlYWRpbmcgYmVjYXVzZVxuLy8gdGhleSByZWZlcnJlZCB0byBKU09OIHNwZWNpZmljYWxseSwgZXZlbiB0aG91Z2ggdGhleSBhY3R1YWxseSB3b3JrIHdpdGggYXJiaXRyYXJ5IEphdmFTY3JpcHQgb2JqZWN0IGxpdGVyYWwgZXhwcmVzc2lvbnMuKVxua28uZXhwb3J0U3ltYm9sKCdqc29uRXhwcmVzc2lvblJld3JpdGluZycsIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcpO1xua28uZXhwb3J0U3ltYm9sKCdqc29uRXhwcmVzc2lvblJld3JpdGluZy5pbnNlcnRQcm9wZXJ0eUFjY2Vzc29yc0ludG9Kc29uJywga28uZXhwcmVzc2lvblJld3JpdGluZy5wcmVQcm9jZXNzQmluZGluZ3MpO1xuKGZ1bmN0aW9uKCkge1xuICAgIC8vIFwiVmlydHVhbCBlbGVtZW50c1wiIGlzIGFuIGFic3RyYWN0aW9uIG9uIHRvcCBvZiB0aGUgdXN1YWwgRE9NIEFQSSB3aGljaCB1bmRlcnN0YW5kcyB0aGUgbm90aW9uIHRoYXQgY29tbWVudCBub2Rlc1xuICAgIC8vIG1heSBiZSB1c2VkIHRvIHJlcHJlc2VudCBoaWVyYXJjaHkgKGluIGFkZGl0aW9uIHRvIHRoZSBET00ncyBuYXR1cmFsIGhpZXJhcmNoeSkuXG4gICAgLy8gSWYgeW91IGNhbGwgdGhlIERPTS1tYW5pcHVsYXRpbmcgZnVuY3Rpb25zIG9uIGtvLnZpcnR1YWxFbGVtZW50cywgeW91IHdpbGwgYmUgYWJsZSB0byByZWFkIGFuZCB3cml0ZSB0aGUgc3RhdGVcbiAgICAvLyBvZiB0aGF0IHZpcnR1YWwgaGllcmFyY2h5XG4gICAgLy9cbiAgICAvLyBUaGUgcG9pbnQgb2YgYWxsIHRoaXMgaXMgdG8gc3VwcG9ydCBjb250YWluZXJsZXNzIHRlbXBsYXRlcyAoZS5nLiwgPCEtLSBrbyBmb3JlYWNoOnNvbWVDb2xsZWN0aW9uIC0tPmJsYWg8IS0tIC9rbyAtLT4pXG4gICAgLy8gd2l0aG91dCBoYXZpbmcgdG8gc2NhdHRlciBzcGVjaWFsIGNhc2VzIGFsbCBvdmVyIHRoZSBiaW5kaW5nIGFuZCB0ZW1wbGF0aW5nIGNvZGUuXG5cbiAgICAvLyBJRSA5IGNhbm5vdCByZWxpYWJseSByZWFkIHRoZSBcIm5vZGVWYWx1ZVwiIHByb3BlcnR5IG9mIGEgY29tbWVudCBub2RlIChzZWUgaHR0cHM6Ly9naXRodWIuY29tL1N0ZXZlU2FuZGVyc29uL2tub2Nrb3V0L2lzc3Vlcy8xODYpXG4gICAgLy8gYnV0IGl0IGRvZXMgZ2l2ZSB0aGVtIGEgbm9uc3RhbmRhcmQgYWx0ZXJuYXRpdmUgcHJvcGVydHkgY2FsbGVkIFwidGV4dFwiIHRoYXQgaXQgY2FuIHJlYWQgcmVsaWFibHkuIE90aGVyIGJyb3dzZXJzIGRvbid0IGhhdmUgdGhhdCBwcm9wZXJ0eS5cbiAgICAvLyBTbywgdXNlIG5vZGUudGV4dCB3aGVyZSBhdmFpbGFibGUsIGFuZCBub2RlLm5vZGVWYWx1ZSBlbHNld2hlcmVcbiAgICB2YXIgY29tbWVudE5vZGVzSGF2ZVRleHRQcm9wZXJ0eSA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoXCJ0ZXN0XCIpLnRleHQgPT09IFwiPCEtLXRlc3QtLT5cIjtcblxuICAgIHZhciBzdGFydENvbW1lbnRSZWdleCA9IGNvbW1lbnROb2Rlc0hhdmVUZXh0UHJvcGVydHkgPyAvXjwhLS1cXHMqa28oPzpcXHMrKFtcXHNcXFNdKykpP1xccyotLT4kLyA6IC9eXFxzKmtvKD86XFxzKyhbXFxzXFxTXSspKT9cXHMqJC87XG4gICAgdmFyIGVuZENvbW1lbnRSZWdleCA9ICAgY29tbWVudE5vZGVzSGF2ZVRleHRQcm9wZXJ0eSA/IC9ePCEtLVxccypcXC9rb1xccyotLT4kLyA6IC9eXFxzKlxcL2tvXFxzKiQvO1xuICAgIHZhciBodG1sVGFnc1dpdGhPcHRpb25hbGx5Q2xvc2luZ0NoaWxkcmVuID0geyAndWwnOiB0cnVlLCAnb2wnOiB0cnVlIH07XG5cbiAgICBmdW5jdGlvbiBpc1N0YXJ0Q29tbWVudChub2RlKSB7XG4gICAgICAgIHJldHVybiAobm9kZS5ub2RlVHlwZSA9PSA4KSAmJiBzdGFydENvbW1lbnRSZWdleC50ZXN0KGNvbW1lbnROb2Rlc0hhdmVUZXh0UHJvcGVydHkgPyBub2RlLnRleHQgOiBub2RlLm5vZGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNFbmRDb21tZW50KG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIChub2RlLm5vZGVUeXBlID09IDgpICYmIGVuZENvbW1lbnRSZWdleC50ZXN0KGNvbW1lbnROb2Rlc0hhdmVUZXh0UHJvcGVydHkgPyBub2RlLnRleHQgOiBub2RlLm5vZGVWYWx1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VmlydHVhbENoaWxkcmVuKHN0YXJ0Q29tbWVudCwgYWxsb3dVbmJhbGFuY2VkKSB7XG4gICAgICAgIHZhciBjdXJyZW50Tm9kZSA9IHN0YXJ0Q29tbWVudDtcbiAgICAgICAgdmFyIGRlcHRoID0gMTtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XG4gICAgICAgIHdoaWxlIChjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICBpZiAoaXNFbmRDb21tZW50KGN1cnJlbnROb2RlKSkge1xuICAgICAgICAgICAgICAgIGRlcHRoLS07XG4gICAgICAgICAgICAgICAgaWYgKGRlcHRoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGRyZW47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goY3VycmVudE5vZGUpO1xuXG4gICAgICAgICAgICBpZiAoaXNTdGFydENvbW1lbnQoY3VycmVudE5vZGUpKVxuICAgICAgICAgICAgICAgIGRlcHRoKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhbGxvd1VuYmFsYW5jZWQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBjbG9zaW5nIGNvbW1lbnQgdGFnIHRvIG1hdGNoOiBcIiArIHN0YXJ0Q29tbWVudC5ub2RlVmFsdWUpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNYXRjaGluZ0VuZENvbW1lbnQoc3RhcnRDb21tZW50LCBhbGxvd1VuYmFsYW5jZWQpIHtcbiAgICAgICAgdmFyIGFsbFZpcnR1YWxDaGlsZHJlbiA9IGdldFZpcnR1YWxDaGlsZHJlbihzdGFydENvbW1lbnQsIGFsbG93VW5iYWxhbmNlZCk7XG4gICAgICAgIGlmIChhbGxWaXJ0dWFsQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmIChhbGxWaXJ0dWFsQ2hpbGRyZW4ubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gYWxsVmlydHVhbENoaWxkcmVuW2FsbFZpcnR1YWxDaGlsZHJlbi5sZW5ndGggLSAxXS5uZXh0U2libGluZztcbiAgICAgICAgICAgIHJldHVybiBzdGFydENvbW1lbnQubmV4dFNpYmxpbmc7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7IC8vIE11c3QgaGF2ZSBubyBtYXRjaGluZyBlbmQgY29tbWVudCwgYW5kIGFsbG93VW5iYWxhbmNlZCBpcyB0cnVlXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VW5iYWxhbmNlZENoaWxkVGFncyhub2RlKSB7XG4gICAgICAgIC8vIGUuZy4sIGZyb20gPGRpdj5PSzwvZGl2PjwhLS0ga28gYmxhaCAtLT48c3Bhbj5Bbm90aGVyPC9zcGFuPiwgcmV0dXJuczogPCEtLSBrbyBibGFoIC0tPjxzcGFuPkFub3RoZXI8L3NwYW4+XG4gICAgICAgIC8vICAgICAgIGZyb20gPGRpdj5PSzwvZGl2PjwhLS0gL2tvIC0tPjwhLS0gL2tvIC0tPiwgICAgICAgICAgICAgcmV0dXJuczogPCEtLSAva28gLS0+PCEtLSAva28gLS0+XG4gICAgICAgIHZhciBjaGlsZE5vZGUgPSBub2RlLmZpcnN0Q2hpbGQsIGNhcHR1cmVSZW1haW5pbmcgPSBudWxsO1xuICAgICAgICBpZiAoY2hpbGROb2RlKSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGNhcHR1cmVSZW1haW5pbmcpICAgICAgICAgICAgICAgICAgIC8vIFdlIGFscmVhZHkgaGl0IGFuIHVuYmFsYW5jZWQgbm9kZSBhbmQgYXJlIG5vdyBqdXN0IHNjb29waW5nIHVwIGFsbCBzdWJzZXF1ZW50IG5vZGVzXG4gICAgICAgICAgICAgICAgICAgIGNhcHR1cmVSZW1haW5pbmcucHVzaChjaGlsZE5vZGUpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzU3RhcnRDb21tZW50KGNoaWxkTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoaW5nRW5kQ29tbWVudCA9IGdldE1hdGNoaW5nRW5kQ29tbWVudChjaGlsZE5vZGUsIC8qIGFsbG93VW5iYWxhbmNlZDogKi8gdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaGluZ0VuZENvbW1lbnQpICAgICAgICAgICAgIC8vIEl0J3MgYSBiYWxhbmNlZCB0YWcsIHNvIHNraXAgaW1tZWRpYXRlbHkgdG8gdGhlIGVuZCBvZiB0aGlzIHZpcnR1YWwgc2V0XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZE5vZGUgPSBtYXRjaGluZ0VuZENvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmVSZW1haW5pbmcgPSBbY2hpbGROb2RlXTsgLy8gSXQncyB1bmJhbGFuY2VkLCBzbyBzdGFydCBjYXB0dXJpbmcgZnJvbSB0aGlzIHBvaW50XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0VuZENvbW1lbnQoY2hpbGROb2RlKSkge1xuICAgICAgICAgICAgICAgICAgICBjYXB0dXJlUmVtYWluaW5nID0gW2NoaWxkTm9kZV07ICAgICAvLyBJdCdzIHVuYmFsYW5jZWQgKGlmIGl0IHdhc24ndCwgd2UnZCBoYXZlIHNraXBwZWQgb3ZlciBpdCBhbHJlYWR5KSwgc28gc3RhcnQgY2FwdHVyaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSAoY2hpbGROb2RlID0gY2hpbGROb2RlLm5leHRTaWJsaW5nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FwdHVyZVJlbWFpbmluZztcbiAgICB9XG5cbiAgICBrby52aXJ0dWFsRWxlbWVudHMgPSB7XG4gICAgICAgIGFsbG93ZWRCaW5kaW5nczoge30sXG5cbiAgICAgICAgY2hpbGROb2RlczogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzU3RhcnRDb21tZW50KG5vZGUpID8gZ2V0VmlydHVhbENoaWxkcmVuKG5vZGUpIDogbm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGVtcHR5Tm9kZTogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgaWYgKCFpc1N0YXJ0Q29tbWVudChub2RlKSlcbiAgICAgICAgICAgICAgICBrby51dGlscy5lbXB0eURvbU5vZGUobm9kZSk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgdmlydHVhbENoaWxkcmVuID0ga28udmlydHVhbEVsZW1lbnRzLmNoaWxkTm9kZXMobm9kZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSB2aXJ0dWFsQ2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKVxuICAgICAgICAgICAgICAgICAgICBrby5yZW1vdmVOb2RlKHZpcnR1YWxDaGlsZHJlbltpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0RG9tTm9kZUNoaWxkcmVuOiBmdW5jdGlvbihub2RlLCBjaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoIWlzU3RhcnRDb21tZW50KG5vZGUpKVxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldERvbU5vZGVDaGlsZHJlbihub2RlLCBjaGlsZE5vZGVzKTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5lbXB0eU5vZGUobm9kZSk7XG4gICAgICAgICAgICAgICAgdmFyIGVuZENvbW1lbnROb2RlID0gbm9kZS5uZXh0U2libGluZzsgLy8gTXVzdCBiZSB0aGUgbmV4dCBzaWJsaW5nLCBhcyB3ZSBqdXN0IGVtcHRpZWQgdGhlIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGogPSBjaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGo7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgZW5kQ29tbWVudE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2hpbGROb2Rlc1tpXSwgZW5kQ29tbWVudE5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHByZXBlbmQ6IGZ1bmN0aW9uKGNvbnRhaW5lck5vZGUsIG5vZGVUb1ByZXBlbmQpIHtcbiAgICAgICAgICAgIGlmICghaXNTdGFydENvbW1lbnQoY29udGFpbmVyTm9kZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29udGFpbmVyTm9kZS5maXJzdENoaWxkKVxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJOb2RlLmluc2VydEJlZm9yZShub2RlVG9QcmVwZW5kLCBjb250YWluZXJOb2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyTm9kZS5hcHBlbmRDaGlsZChub2RlVG9QcmVwZW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU3RhcnQgY29tbWVudHMgbXVzdCBhbHdheXMgaGF2ZSBhIHBhcmVudCBhbmQgYXQgbGVhc3Qgb25lIGZvbGxvd2luZyBzaWJsaW5nICh0aGUgZW5kIGNvbW1lbnQpXG4gICAgICAgICAgICAgICAgY29udGFpbmVyTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlVG9QcmVwZW5kLCBjb250YWluZXJOb2RlLm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpbnNlcnRBZnRlcjogZnVuY3Rpb24oY29udGFpbmVyTm9kZSwgbm9kZVRvSW5zZXJ0LCBpbnNlcnRBZnRlck5vZGUpIHtcbiAgICAgICAgICAgIGlmICghaW5zZXJ0QWZ0ZXJOb2RlKSB7XG4gICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLnByZXBlbmQoY29udGFpbmVyTm9kZSwgbm9kZVRvSW5zZXJ0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzU3RhcnRDb21tZW50KGNvbnRhaW5lck5vZGUpKSB7XG4gICAgICAgICAgICAgICAgLy8gSW5zZXJ0IGFmdGVyIGluc2VydGlvbiBwb2ludFxuICAgICAgICAgICAgICAgIGlmIChpbnNlcnRBZnRlck5vZGUubmV4dFNpYmxpbmcpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lck5vZGUuaW5zZXJ0QmVmb3JlKG5vZGVUb0luc2VydCwgaW5zZXJ0QWZ0ZXJOb2RlLm5leHRTaWJsaW5nKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lck5vZGUuYXBwZW5kQ2hpbGQobm9kZVRvSW5zZXJ0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hpbGRyZW4gb2Ygc3RhcnQgY29tbWVudHMgbXVzdCBhbHdheXMgaGF2ZSBhIHBhcmVudCBhbmQgYXQgbGVhc3Qgb25lIGZvbGxvd2luZyBzaWJsaW5nICh0aGUgZW5kIGNvbW1lbnQpXG4gICAgICAgICAgICAgICAgY29udGFpbmVyTm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlVG9JbnNlcnQsIGluc2VydEFmdGVyTm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmlyc3RDaGlsZDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgaWYgKCFpc1N0YXJ0Q29tbWVudChub2RlKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICAgICAgaWYgKCFub2RlLm5leHRTaWJsaW5nIHx8IGlzRW5kQ29tbWVudChub2RlLm5leHRTaWJsaW5nKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgICB9LFxuXG4gICAgICAgIG5leHRTaWJsaW5nOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBpZiAoaXNTdGFydENvbW1lbnQobm9kZSkpXG4gICAgICAgICAgICAgICAgbm9kZSA9IGdldE1hdGNoaW5nRW5kQ29tbWVudChub2RlKTtcbiAgICAgICAgICAgIGlmIChub2RlLm5leHRTaWJsaW5nICYmIGlzRW5kQ29tbWVudChub2RlLm5leHRTaWJsaW5nKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhhc0JpbmRpbmdWYWx1ZTogaXNTdGFydENvbW1lbnQsXG5cbiAgICAgICAgdmlydHVhbE5vZGVCaW5kaW5nVmFsdWU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciByZWdleE1hdGNoID0gKGNvbW1lbnROb2Rlc0hhdmVUZXh0UHJvcGVydHkgPyBub2RlLnRleHQgOiBub2RlLm5vZGVWYWx1ZSkubWF0Y2goc3RhcnRDb21tZW50UmVnZXgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlZ2V4TWF0Y2ggPyByZWdleE1hdGNoWzFdIDogbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBub3JtYWxpc2VWaXJ0dWFsRWxlbWVudERvbVN0cnVjdHVyZTogZnVuY3Rpb24oZWxlbWVudFZlcmlmaWVkKSB7XG4gICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzE1NVxuICAgICAgICAgICAgLy8gKElFIDw9IDggb3IgSUUgOSBxdWlya3MgbW9kZSBwYXJzZXMgeW91ciBIVE1MIHdlaXJkbHksIHRyZWF0aW5nIGNsb3NpbmcgPC9saT4gdGFncyBhcyBpZiB0aGV5IGRvbid0IGV4aXN0LCB0aGVyZWJ5IG1vdmluZyBjb21tZW50IG5vZGVzXG4gICAgICAgICAgICAvLyB0aGF0IGFyZSBkaXJlY3QgZGVzY2VuZGFudHMgb2YgPHVsPiBpbnRvIHRoZSBwcmVjZWRpbmcgPGxpPilcbiAgICAgICAgICAgIGlmICghaHRtbFRhZ3NXaXRoT3B0aW9uYWxseUNsb3NpbmdDaGlsZHJlbltrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudFZlcmlmaWVkKV0pXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBTY2FuIGltbWVkaWF0ZSBjaGlsZHJlbiB0byBzZWUgaWYgdGhleSBjb250YWluIHVuYmFsYW5jZWQgY29tbWVudCB0YWdzLiBJZiB0aGV5IGRvLCB0aG9zZSBjb21tZW50IHRhZ3NcbiAgICAgICAgICAgIC8vIG11c3QgYmUgaW50ZW5kZWQgdG8gYXBwZWFyICphZnRlciogdGhhdCBjaGlsZCwgc28gbW92ZSB0aGVtIHRoZXJlLlxuICAgICAgICAgICAgdmFyIGNoaWxkTm9kZSA9IGVsZW1lbnRWZXJpZmllZC5maXJzdENoaWxkO1xuICAgICAgICAgICAgaWYgKGNoaWxkTm9kZSkge1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVuYmFsYW5jZWRUYWdzID0gZ2V0VW5iYWxhbmNlZENoaWxkVGFncyhjaGlsZE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVuYmFsYW5jZWRUYWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRml4IHVwIHRoZSBET00gYnkgbW92aW5nIHRoZSB1bmJhbGFuY2VkIHRhZ3MgdG8gd2hlcmUgdGhleSBtb3N0IGxpa2VseSB3ZXJlIGludGVuZGVkIHRvIGJlIHBsYWNlZCAtICphZnRlciogdGhlIGNoaWxkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGVUb0luc2VydEJlZm9yZSA9IGNoaWxkTm9kZS5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHVuYmFsYW5jZWRUYWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlVG9JbnNlcnRCZWZvcmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VmVyaWZpZWQuaW5zZXJ0QmVmb3JlKHVuYmFsYW5jZWRUYWdzW2ldLCBub2RlVG9JbnNlcnRCZWZvcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VmVyaWZpZWQuYXBwZW5kQ2hpbGQodW5iYWxhbmNlZFRhZ3NbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufSkoKTtcbmtvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzJywga28udmlydHVhbEVsZW1lbnRzKTtcbmtvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5ncycsIGtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3MpO1xua28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMuZW1wdHlOb2RlJywga28udmlydHVhbEVsZW1lbnRzLmVtcHR5Tm9kZSk7XG4vL2tvLmV4cG9ydFN5bWJvbCgndmlydHVhbEVsZW1lbnRzLmZpcnN0Q2hpbGQnLCBrby52aXJ0dWFsRWxlbWVudHMuZmlyc3RDaGlsZCk7ICAgICAvLyBmaXJzdENoaWxkIGlzIG5vdCBtaW5pZmllZFxua28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMuaW5zZXJ0QWZ0ZXInLCBrby52aXJ0dWFsRWxlbWVudHMuaW5zZXJ0QWZ0ZXIpO1xuLy9rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cy5uZXh0U2libGluZycsIGtvLnZpcnR1YWxFbGVtZW50cy5uZXh0U2libGluZyk7ICAgLy8gbmV4dFNpYmxpbmcgaXMgbm90IG1pbmlmaWVkXG5rby5leHBvcnRTeW1ib2woJ3ZpcnR1YWxFbGVtZW50cy5wcmVwZW5kJywga28udmlydHVhbEVsZW1lbnRzLnByZXBlbmQpO1xua28uZXhwb3J0U3ltYm9sKCd2aXJ0dWFsRWxlbWVudHMuc2V0RG9tTm9kZUNoaWxkcmVuJywga28udmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbik7XG4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRlZmF1bHRCaW5kaW5nQXR0cmlidXRlTmFtZSA9IFwiZGF0YS1iaW5kXCI7XG5cbiAgICBrby5iaW5kaW5nUHJvdmlkZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5iaW5kaW5nQ2FjaGUgPSB7fTtcbiAgICB9O1xuXG4gICAga28udXRpbHMuZXh0ZW5kKGtvLmJpbmRpbmdQcm92aWRlci5wcm90b3R5cGUsIHtcbiAgICAgICAgJ25vZGVIYXNCaW5kaW5ncyc6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMTogLy8gRWxlbWVudFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUoZGVmYXVsdEJpbmRpbmdBdHRyaWJ1dGVOYW1lKSAhPSBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICB8fCBrby5jb21wb25lbnRzWydnZXRDb21wb25lbnROYW1lRm9yTm9kZSddKG5vZGUpO1xuICAgICAgICAgICAgICAgIGNhc2UgODogLy8gQ29tbWVudCBub2RlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrby52aXJ0dWFsRWxlbWVudHMuaGFzQmluZGluZ1ZhbHVlKG5vZGUpO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAnZ2V0QmluZGluZ3MnOiBmdW5jdGlvbihub2RlLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgdmFyIGJpbmRpbmdzU3RyaW5nID0gdGhpc1snZ2V0QmluZGluZ3NTdHJpbmcnXShub2RlLCBiaW5kaW5nQ29udGV4dCksXG4gICAgICAgICAgICAgICAgcGFyc2VkQmluZGluZ3MgPSBiaW5kaW5nc1N0cmluZyA/IHRoaXNbJ3BhcnNlQmluZGluZ3NTdHJpbmcnXShiaW5kaW5nc1N0cmluZywgYmluZGluZ0NvbnRleHQsIG5vZGUpIDogbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBrby5jb21wb25lbnRzLmFkZEJpbmRpbmdzRm9yQ3VzdG9tRWxlbWVudChwYXJzZWRCaW5kaW5ncywgbm9kZSwgYmluZGluZ0NvbnRleHQsIC8qIHZhbHVlQWNjZXNzb3JzICovIGZhbHNlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnZ2V0QmluZGluZ0FjY2Vzc29ycyc6IGZ1bmN0aW9uKG5vZGUsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgYmluZGluZ3NTdHJpbmcgPSB0aGlzWydnZXRCaW5kaW5nc1N0cmluZyddKG5vZGUsIGJpbmRpbmdDb250ZXh0KSxcbiAgICAgICAgICAgICAgICBwYXJzZWRCaW5kaW5ncyA9IGJpbmRpbmdzU3RyaW5nID8gdGhpc1sncGFyc2VCaW5kaW5nc1N0cmluZyddKGJpbmRpbmdzU3RyaW5nLCBiaW5kaW5nQ29udGV4dCwgbm9kZSwgeyAndmFsdWVBY2Nlc3NvcnMnOiB0cnVlIH0pIDogbnVsbDtcbiAgICAgICAgICAgIHJldHVybiBrby5jb21wb25lbnRzLmFkZEJpbmRpbmdzRm9yQ3VzdG9tRWxlbWVudChwYXJzZWRCaW5kaW5ncywgbm9kZSwgYmluZGluZ0NvbnRleHQsIC8qIHZhbHVlQWNjZXNzb3JzICovIHRydWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgZnVuY3Rpb24gaXMgb25seSB1c2VkIGludGVybmFsbHkgYnkgdGhpcyBkZWZhdWx0IHByb3ZpZGVyLlxuICAgICAgICAvLyBJdCdzIG5vdCBwYXJ0IG9mIHRoZSBpbnRlcmZhY2UgZGVmaW5pdGlvbiBmb3IgYSBnZW5lcmFsIGJpbmRpbmcgcHJvdmlkZXIuXG4gICAgICAgICdnZXRCaW5kaW5nc1N0cmluZyc6IGZ1bmN0aW9uKG5vZGUsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDE6IHJldHVybiBub2RlLmdldEF0dHJpYnV0ZShkZWZhdWx0QmluZGluZ0F0dHJpYnV0ZU5hbWUpOyAgIC8vIEVsZW1lbnRcbiAgICAgICAgICAgICAgICBjYXNlIDg6IHJldHVybiBrby52aXJ0dWFsRWxlbWVudHMudmlydHVhbE5vZGVCaW5kaW5nVmFsdWUobm9kZSk7IC8vIENvbW1lbnQgbm9kZVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgZnVuY3Rpb24gaXMgb25seSB1c2VkIGludGVybmFsbHkgYnkgdGhpcyBkZWZhdWx0IHByb3ZpZGVyLlxuICAgICAgICAvLyBJdCdzIG5vdCBwYXJ0IG9mIHRoZSBpbnRlcmZhY2UgZGVmaW5pdGlvbiBmb3IgYSBnZW5lcmFsIGJpbmRpbmcgcHJvdmlkZXIuXG4gICAgICAgICdwYXJzZUJpbmRpbmdzU3RyaW5nJzogZnVuY3Rpb24oYmluZGluZ3NTdHJpbmcsIGJpbmRpbmdDb250ZXh0LCBub2RlLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciBiaW5kaW5nRnVuY3Rpb24gPSBjcmVhdGVCaW5kaW5nc1N0cmluZ0V2YWx1YXRvclZpYUNhY2hlKGJpbmRpbmdzU3RyaW5nLCB0aGlzLmJpbmRpbmdDYWNoZSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmdGdW5jdGlvbihiaW5kaW5nQ29udGV4dCwgbm9kZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgIGV4Lm1lc3NhZ2UgPSBcIlVuYWJsZSB0byBwYXJzZSBiaW5kaW5ncy5cXG5CaW5kaW5ncyB2YWx1ZTogXCIgKyBiaW5kaW5nc1N0cmluZyArIFwiXFxuTWVzc2FnZTogXCIgKyBleC5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIHRocm93IGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBrby5iaW5kaW5nUHJvdmlkZXJbJ2luc3RhbmNlJ10gPSBuZXcga28uYmluZGluZ1Byb3ZpZGVyKCk7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVCaW5kaW5nc1N0cmluZ0V2YWx1YXRvclZpYUNhY2hlKGJpbmRpbmdzU3RyaW5nLCBjYWNoZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgY2FjaGVLZXkgPSBiaW5kaW5nc1N0cmluZyArIChvcHRpb25zICYmIG9wdGlvbnNbJ3ZhbHVlQWNjZXNzb3JzJ10gfHwgJycpO1xuICAgICAgICByZXR1cm4gY2FjaGVbY2FjaGVLZXldXG4gICAgICAgICAgICB8fCAoY2FjaGVbY2FjaGVLZXldID0gY3JlYXRlQmluZGluZ3NTdHJpbmdFdmFsdWF0b3IoYmluZGluZ3NTdHJpbmcsIG9wdGlvbnMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVCaW5kaW5nc1N0cmluZ0V2YWx1YXRvcihiaW5kaW5nc1N0cmluZywgb3B0aW9ucykge1xuICAgICAgICAvLyBCdWlsZCB0aGUgc291cmNlIGZvciBhIGZ1bmN0aW9uIHRoYXQgZXZhbHVhdGVzIFwiZXhwcmVzc2lvblwiXG4gICAgICAgIC8vIEZvciBlYWNoIHNjb3BlIHZhcmlhYmxlLCBhZGQgYW4gZXh0cmEgbGV2ZWwgb2YgXCJ3aXRoXCIgbmVzdGluZ1xuICAgICAgICAvLyBFeGFtcGxlIHJlc3VsdDogd2l0aChzYzEpIHsgd2l0aChzYzApIHsgcmV0dXJuIChleHByZXNzaW9uKSB9IH1cbiAgICAgICAgdmFyIHJld3JpdHRlbkJpbmRpbmdzID0ga28uZXhwcmVzc2lvblJld3JpdGluZy5wcmVQcm9jZXNzQmluZGluZ3MoYmluZGluZ3NTdHJpbmcsIG9wdGlvbnMpLFxuICAgICAgICAgICAgZnVuY3Rpb25Cb2R5ID0gXCJ3aXRoKCRjb250ZXh0KXt3aXRoKCRkYXRhfHx7fSl7cmV0dXJue1wiICsgcmV3cml0dGVuQmluZGluZ3MgKyBcIn19fVwiO1xuICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKFwiJGNvbnRleHRcIiwgXCIkZWxlbWVudFwiLCBmdW5jdGlvbkJvZHkpO1xuICAgIH1cbn0pKCk7XG5cbmtvLmV4cG9ydFN5bWJvbCgnYmluZGluZ1Byb3ZpZGVyJywga28uYmluZGluZ1Byb3ZpZGVyKTtcbihmdW5jdGlvbiAoKSB7XG4gICAga28uYmluZGluZ0hhbmRsZXJzID0ge307XG5cbiAgICAvLyBUaGUgZm9sbG93aW5nIGVsZW1lbnQgdHlwZXMgd2lsbCBub3QgYmUgcmVjdXJzZWQgaW50byBkdXJpbmcgYmluZGluZy5cbiAgICB2YXIgYmluZGluZ0RvZXNOb3RSZWN1cnNlSW50b0VsZW1lbnRUeXBlcyA9IHtcbiAgICAgICAgLy8gRG9uJ3Qgd2FudCBiaW5kaW5ncyB0aGF0IG9wZXJhdGUgb24gdGV4dCBub2RlcyB0byBtdXRhdGUgPHNjcmlwdD4gYW5kIDx0ZXh0YXJlYT4gY29udGVudHMsXG4gICAgICAgIC8vIGJlY2F1c2UgaXQncyB1bmV4cGVjdGVkIGFuZCBhIHBvdGVudGlhbCBYU1MgaXNzdWUuXG4gICAgICAgIC8vIEFsc28gYmluZGluZ3Mgc2hvdWxkIG5vdCBvcGVyYXRlIG9uIDx0ZW1wbGF0ZT4gZWxlbWVudHMgc2luY2UgdGhpcyBicmVha3MgaW4gSW50ZXJuZXQgRXhwbG9yZXJcbiAgICAgICAgLy8gYW5kIGJlY2F1c2Ugc3VjaCBlbGVtZW50cycgY29udGVudHMgYXJlIGFsd2F5cyBpbnRlbmRlZCB0byBiZSBib3VuZCBpbiBhIGRpZmZlcmVudCBjb250ZXh0XG4gICAgICAgIC8vIGZyb20gd2hlcmUgdGhleSBhcHBlYXIgaW4gdGhlIGRvY3VtZW50LlxuICAgICAgICAnc2NyaXB0JzogdHJ1ZSxcbiAgICAgICAgJ3RleHRhcmVhJzogdHJ1ZSxcbiAgICAgICAgJ3RlbXBsYXRlJzogdHJ1ZVxuICAgIH07XG5cbiAgICAvLyBVc2UgYW4gb3ZlcnJpZGFibGUgbWV0aG9kIGZvciByZXRyaWV2aW5nIGJpbmRpbmcgaGFuZGxlcnMgc28gdGhhdCBhIHBsdWdpbnMgbWF5IHN1cHBvcnQgZHluYW1pY2FsbHkgY3JlYXRlZCBoYW5kbGVyc1xuICAgIGtvWydnZXRCaW5kaW5nSGFuZGxlciddID0gZnVuY3Rpb24oYmluZGluZ0tleSkge1xuICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzW2JpbmRpbmdLZXldO1xuICAgIH07XG5cbiAgICAvLyBUaGUga28uYmluZGluZ0NvbnRleHQgY29uc3RydWN0b3IgaXMgb25seSBjYWxsZWQgZGlyZWN0bHkgdG8gY3JlYXRlIHRoZSByb290IGNvbnRleHQuIEZvciBjaGlsZFxuICAgIC8vIGNvbnRleHRzLCB1c2UgYmluZGluZ0NvbnRleHQuY3JlYXRlQ2hpbGRDb250ZXh0IG9yIGJpbmRpbmdDb250ZXh0LmV4dGVuZC5cbiAgICBrby5iaW5kaW5nQ29udGV4dCA9IGZ1bmN0aW9uKGRhdGFJdGVtT3JBY2Nlc3NvciwgcGFyZW50Q29udGV4dCwgZGF0YUl0ZW1BbGlhcywgZXh0ZW5kQ2FsbGJhY2ssIG9wdGlvbnMpIHtcblxuICAgICAgICAvLyBUaGUgYmluZGluZyBjb250ZXh0IG9iamVjdCBpbmNsdWRlcyBzdGF0aWMgcHJvcGVydGllcyBmb3IgdGhlIGN1cnJlbnQsIHBhcmVudCwgYW5kIHJvb3QgdmlldyBtb2RlbHMuXG4gICAgICAgIC8vIElmIGEgdmlldyBtb2RlbCBpcyBhY3R1YWxseSBzdG9yZWQgaW4gYW4gb2JzZXJ2YWJsZSwgdGhlIGNvcnJlc3BvbmRpbmcgYmluZGluZyBjb250ZXh0IG9iamVjdCwgYW5kXG4gICAgICAgIC8vIGFueSBjaGlsZCBjb250ZXh0cywgbXVzdCBiZSB1cGRhdGVkIHdoZW4gdGhlIHZpZXcgbW9kZWwgaXMgY2hhbmdlZC5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlQ29udGV4dCgpIHtcbiAgICAgICAgICAgIC8vIE1vc3Qgb2YgdGhlIHRpbWUsIHRoZSBjb250ZXh0IHdpbGwgZGlyZWN0bHkgZ2V0IGEgdmlldyBtb2RlbCBvYmplY3QsIGJ1dCBpZiBhIGZ1bmN0aW9uIGlzIGdpdmVuLFxuICAgICAgICAgICAgLy8gd2UgY2FsbCB0aGUgZnVuY3Rpb24gdG8gcmV0cmlldmUgdGhlIHZpZXcgbW9kZWwuIElmIHRoZSBmdW5jdGlvbiBhY2Nlc3NlcyBhbnkgb2JzZXJ2YWJsZXMgb3IgcmV0dXJuc1xuICAgICAgICAgICAgLy8gYW4gb2JzZXJ2YWJsZSwgdGhlIGRlcGVuZGVuY3kgaXMgdHJhY2tlZCwgYW5kIHRob3NlIG9ic2VydmFibGVzIGNhbiBsYXRlciBjYXVzZSB0aGUgYmluZGluZ1xuICAgICAgICAgICAgLy8gY29udGV4dCB0byBiZSB1cGRhdGVkLlxuICAgICAgICAgICAgdmFyIGRhdGFJdGVtT3JPYnNlcnZhYmxlID0gaXNGdW5jID8gZGF0YUl0ZW1PckFjY2Vzc29yKCkgOiBkYXRhSXRlbU9yQWNjZXNzb3IsXG4gICAgICAgICAgICAgICAgZGF0YUl0ZW0gPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGRhdGFJdGVtT3JPYnNlcnZhYmxlKTtcblxuICAgICAgICAgICAgaWYgKHBhcmVudENvbnRleHQpIHtcbiAgICAgICAgICAgICAgICAvLyBXaGVuIGEgXCJwYXJlbnRcIiBjb250ZXh0IGlzIGdpdmVuLCByZWdpc3RlciBhIGRlcGVuZGVuY3kgb24gdGhlIHBhcmVudCBjb250ZXh0LiBUaHVzIHdoZW5ldmVyIHRoZVxuICAgICAgICAgICAgICAgIC8vIHBhcmVudCBjb250ZXh0IGlzIHVwZGF0ZWQsIHRoaXMgY29udGV4dCB3aWxsIGFsc28gYmUgdXBkYXRlZC5cbiAgICAgICAgICAgICAgICBpZiAocGFyZW50Q29udGV4dC5fc3Vic2NyaWJhYmxlKVxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRDb250ZXh0Ll9zdWJzY3JpYmFibGUoKTtcblxuICAgICAgICAgICAgICAgIC8vIENvcHkgJHJvb3QgYW5kIGFueSBjdXN0b20gcHJvcGVydGllcyBmcm9tIHRoZSBwYXJlbnQgY29udGV4dFxuICAgICAgICAgICAgICAgIGtvLnV0aWxzLmV4dGVuZChzZWxmLCBwYXJlbnRDb250ZXh0KTtcblxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2UgdGhlIGFib3ZlIGNvcHkgb3ZlcndyaXRlcyBvdXIgb3duIHByb3BlcnRpZXMsIHdlIG5lZWQgdG8gcmVzZXQgdGhlbS5cbiAgICAgICAgICAgICAgICBzZWxmLl9zdWJzY3JpYmFibGUgPSBzdWJzY3JpYmFibGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGZbJyRwYXJlbnRzJ10gPSBbXTtcbiAgICAgICAgICAgICAgICBzZWxmWyckcm9vdCddID0gZGF0YUl0ZW07XG5cbiAgICAgICAgICAgICAgICAvLyBFeHBvcnQgJ2tvJyBpbiB0aGUgYmluZGluZyBjb250ZXh0IHNvIGl0IHdpbGwgYmUgYXZhaWxhYmxlIGluIGJpbmRpbmdzIGFuZCB0ZW1wbGF0ZXNcbiAgICAgICAgICAgICAgICAvLyBldmVuIGlmICdrbycgaXNuJ3QgZXhwb3J0ZWQgYXMgYSBnbG9iYWwsIHN1Y2ggYXMgd2hlbiB1c2luZyBhbiBBTUQgbG9hZGVyLlxuICAgICAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzQ5MFxuICAgICAgICAgICAgICAgIHNlbGZbJ2tvJ10gPSBrbztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGZbJyRyYXdEYXRhJ10gPSBkYXRhSXRlbU9yT2JzZXJ2YWJsZTtcbiAgICAgICAgICAgIHNlbGZbJyRkYXRhJ10gPSBkYXRhSXRlbTtcbiAgICAgICAgICAgIGlmIChkYXRhSXRlbUFsaWFzKVxuICAgICAgICAgICAgICAgIHNlbGZbZGF0YUl0ZW1BbGlhc10gPSBkYXRhSXRlbTtcblxuICAgICAgICAgICAgLy8gVGhlIGV4dGVuZENhbGxiYWNrIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIHdoZW4gY3JlYXRpbmcgYSBjaGlsZCBjb250ZXh0IG9yIGV4dGVuZGluZyBhIGNvbnRleHQuXG4gICAgICAgICAgICAvLyBJdCBoYW5kbGVzIHRoZSBzcGVjaWZpYyBhY3Rpb25zIG5lZWRlZCB0byBmaW5pc2ggc2V0dGluZyB1cCB0aGUgYmluZGluZyBjb250ZXh0LiBBY3Rpb25zIGluIHRoaXNcbiAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGNvdWxkIGFsc28gYWRkIGRlcGVuZGVuY2llcyB0byB0aGlzIGJpbmRpbmcgY29udGV4dC5cbiAgICAgICAgICAgIGlmIChleHRlbmRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICBleHRlbmRDYWxsYmFjayhzZWxmLCBwYXJlbnRDb250ZXh0LCBkYXRhSXRlbSk7XG5cbiAgICAgICAgICAgIHJldHVybiBzZWxmWyckZGF0YSddO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGRpc3Bvc2VXaGVuKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVzICYmICFrby51dGlscy5hbnlEb21Ob2RlSXNBdHRhY2hlZFRvRG9jdW1lbnQobm9kZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgaXNGdW5jID0gdHlwZW9mKGRhdGFJdGVtT3JBY2Nlc3NvcikgPT0gXCJmdW5jdGlvblwiICYmICFrby5pc09ic2VydmFibGUoZGF0YUl0ZW1PckFjY2Vzc29yKSxcbiAgICAgICAgICAgIG5vZGVzLFxuICAgICAgICAgICAgc3Vic2NyaWJhYmxlO1xuXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnNbJ2V4cG9ydERlcGVuZGVuY2llcyddKSB7XG4gICAgICAgICAgICAvLyBUaGUgXCJleHBvcnREZXBlbmRlbmNpZXNcIiBvcHRpb24gbWVhbnMgdGhhdCB0aGUgY2FsbGluZyBjb2RlIHdpbGwgdHJhY2sgYW55IGRlcGVuZGVuY2llcyBhbmQgcmUtY3JlYXRlXG4gICAgICAgICAgICAvLyB0aGUgYmluZGluZyBjb250ZXh0IHdoZW4gdGhleSBjaGFuZ2UuXG4gICAgICAgICAgICB1cGRhdGVDb250ZXh0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdWJzY3JpYmFibGUgPSBrby5kZXBlbmRlbnRPYnNlcnZhYmxlKHVwZGF0ZUNvbnRleHQsIG51bGwsIHsgZGlzcG9zZVdoZW46IGRpc3Bvc2VXaGVuLCBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IHRydWUgfSk7XG5cbiAgICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQsIHRoZSBiaW5kaW5nIGNvbnRleHQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQsIGFuZCB0aGUgXCJzdWJzY3JpYmFibGVcIiBjb21wdXRlZCBvYnNlcnZhYmxlIGlzXG4gICAgICAgICAgICAvLyBzdWJzY3JpYmVkIHRvIGFueSBvYnNlcnZhYmxlcyB0aGF0IHdlcmUgYWNjZXNzZWQgaW4gdGhlIHByb2Nlc3MuIElmIHRoZXJlIGlzIG5vdGhpbmcgdG8gdHJhY2ssIHRoZVxuICAgICAgICAgICAgLy8gY29tcHV0ZWQgd2lsbCBiZSBpbmFjdGl2ZSwgYW5kIHdlIGNhbiBzYWZlbHkgdGhyb3cgaXQgYXdheS4gSWYgaXQncyBhY3RpdmUsIHRoZSBjb21wdXRlZCBpcyBzdG9yZWQgaW5cbiAgICAgICAgICAgIC8vIHRoZSBjb250ZXh0IG9iamVjdC5cbiAgICAgICAgICAgIGlmIChzdWJzY3JpYmFibGUuaXNBY3RpdmUoKSkge1xuICAgICAgICAgICAgICAgIHNlbGYuX3N1YnNjcmliYWJsZSA9IHN1YnNjcmliYWJsZTtcblxuICAgICAgICAgICAgICAgIC8vIEFsd2F5cyBub3RpZnkgYmVjYXVzZSBldmVuIGlmIHRoZSBtb2RlbCAoJGRhdGEpIGhhc24ndCBjaGFuZ2VkLCBvdGhlciBjb250ZXh0IHByb3BlcnRpZXMgbWlnaHQgaGF2ZSBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgc3Vic2NyaWJhYmxlWydlcXVhbGl0eUNvbXBhcmVyJ10gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBiZSBhYmxlIHRvIGRpc3Bvc2Ugb2YgdGhpcyBjb21wdXRlZCBvYnNlcnZhYmxlIHdoZW4gaXQncyBubyBsb25nZXIgbmVlZGVkLiBUaGlzIHdvdWxkIGJlXG4gICAgICAgICAgICAgICAgLy8gZWFzeSBpZiB3ZSBoYWQgYSBzaW5nbGUgbm9kZSB0byB3YXRjaCwgYnV0IGJpbmRpbmcgY29udGV4dHMgY2FuIGJlIHVzZWQgYnkgbWFueSBkaWZmZXJlbnQgbm9kZXMsIGFuZFxuICAgICAgICAgICAgICAgIC8vIHdlIGNhbm5vdCBhc3N1bWUgdGhhdCB0aG9zZSBub2RlcyBoYXZlIGFueSByZWxhdGlvbiB0byBlYWNoIG90aGVyLiBTbyBpbnN0ZWFkIHdlIHRyYWNrIGFueSBub2RlIHRoYXRcbiAgICAgICAgICAgICAgICAvLyB0aGUgY29udGV4dCBpcyBhdHRhY2hlZCB0bywgYW5kIGRpc3Bvc2UgdGhlIGNvbXB1dGVkIHdoZW4gYWxsIG9mIHRob3NlIG5vZGVzIGhhdmUgYmVlbiBjbGVhbmVkLlxuXG4gICAgICAgICAgICAgICAgLy8gQWRkIHByb3BlcnRpZXMgdG8gKnN1YnNjcmliYWJsZSogaW5zdGVhZCBvZiAqc2VsZiogYmVjYXVzZSBhbnkgcHJvcGVydGllcyBhZGRlZCB0byAqc2VsZiogbWF5IGJlIG92ZXJ3cml0dGVuIG9uIHVwZGF0ZXNcbiAgICAgICAgICAgICAgICBub2RlcyA9IFtdO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliYWJsZS5fYWRkTm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhub2RlLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheVJlbW92ZUl0ZW0obm9kZXMsIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmFibGUuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX3N1YnNjcmliYWJsZSA9IHN1YnNjcmliYWJsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEV4dGVuZCB0aGUgYmluZGluZyBjb250ZXh0IGhpZXJhcmNoeSB3aXRoIGEgbmV3IHZpZXcgbW9kZWwgb2JqZWN0LiBJZiB0aGUgcGFyZW50IGNvbnRleHQgaXMgd2F0Y2hpbmdcbiAgICAvLyBhbnkgb2JzZXJ2YWJsZXMsIHRoZSBuZXcgY2hpbGQgY29udGV4dCB3aWxsIGF1dG9tYXRpY2FsbHkgZ2V0IGEgZGVwZW5kZW5jeSBvbiB0aGUgcGFyZW50IGNvbnRleHQuXG4gICAgLy8gQnV0IHRoaXMgZG9lcyBub3QgbWVhbiB0aGF0IHRoZSAkZGF0YSB2YWx1ZSBvZiB0aGUgY2hpbGQgY29udGV4dCB3aWxsIGFsc28gZ2V0IHVwZGF0ZWQuIElmIHRoZSBjaGlsZFxuICAgIC8vIHZpZXcgbW9kZWwgYWxzbyBkZXBlbmRzIG9uIHRoZSBwYXJlbnQgdmlldyBtb2RlbCwgeW91IG11c3QgcHJvdmlkZSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY29ycmVjdFxuICAgIC8vIHZpZXcgbW9kZWwgb24gZWFjaCB1cGRhdGUuXG4gICAga28uYmluZGluZ0NvbnRleHQucHJvdG90eXBlWydjcmVhdGVDaGlsZENvbnRleHQnXSA9IGZ1bmN0aW9uIChkYXRhSXRlbU9yQWNjZXNzb3IsIGRhdGFJdGVtQWxpYXMsIGV4dGVuZENhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBuZXcga28uYmluZGluZ0NvbnRleHQoZGF0YUl0ZW1PckFjY2Vzc29yLCB0aGlzLCBkYXRhSXRlbUFsaWFzLCBmdW5jdGlvbihzZWxmLCBwYXJlbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAvLyBFeHRlbmQgdGhlIGNvbnRleHQgaGllcmFyY2h5IGJ5IHNldHRpbmcgdGhlIGFwcHJvcHJpYXRlIHBvaW50ZXJzXG4gICAgICAgICAgICBzZWxmWyckcGFyZW50Q29udGV4dCddID0gcGFyZW50Q29udGV4dDtcbiAgICAgICAgICAgIHNlbGZbJyRwYXJlbnQnXSA9IHBhcmVudENvbnRleHRbJyRkYXRhJ107XG4gICAgICAgICAgICBzZWxmWyckcGFyZW50cyddID0gKHBhcmVudENvbnRleHRbJyRwYXJlbnRzJ10gfHwgW10pLnNsaWNlKDApO1xuICAgICAgICAgICAgc2VsZlsnJHBhcmVudHMnXS51bnNoaWZ0KHNlbGZbJyRwYXJlbnQnXSk7XG4gICAgICAgICAgICBpZiAoZXh0ZW5kQ2FsbGJhY2spXG4gICAgICAgICAgICAgICAgZXh0ZW5kQ2FsbGJhY2soc2VsZik7XG4gICAgICAgIH0sIG9wdGlvbnMpO1xuICAgIH07XG5cbiAgICAvLyBFeHRlbmQgdGhlIGJpbmRpbmcgY29udGV4dCB3aXRoIG5ldyBjdXN0b20gcHJvcGVydGllcy4gVGhpcyBkb2Vzbid0IGNoYW5nZSB0aGUgY29udGV4dCBoaWVyYXJjaHkuXG4gICAgLy8gU2ltaWxhcmx5IHRvIFwiY2hpbGRcIiBjb250ZXh0cywgcHJvdmlkZSBhIGZ1bmN0aW9uIGhlcmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGNvcnJlY3QgdmFsdWVzIGFyZSBzZXRcbiAgICAvLyB3aGVuIGFuIG9ic2VydmFibGUgdmlldyBtb2RlbCBpcyB1cGRhdGVkLlxuICAgIGtvLmJpbmRpbmdDb250ZXh0LnByb3RvdHlwZVsnZXh0ZW5kJ10gPSBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG4gICAgICAgIC8vIElmIHRoZSBwYXJlbnQgY29udGV4dCByZWZlcmVuY2VzIGFuIG9ic2VydmFibGUgdmlldyBtb2RlbCwgXCJfc3Vic2NyaWJhYmxlXCIgd2lsbCBhbHdheXMgYmUgdGhlXG4gICAgICAgIC8vIGxhdGVzdCB2aWV3IG1vZGVsIG9iamVjdC4gSWYgbm90LCBcIl9zdWJzY3JpYmFibGVcIiBpc24ndCBzZXQsIGFuZCB3ZSBjYW4gdXNlIHRoZSBzdGF0aWMgXCIkZGF0YVwiIHZhbHVlLlxuICAgICAgICByZXR1cm4gbmV3IGtvLmJpbmRpbmdDb250ZXh0KHRoaXMuX3N1YnNjcmliYWJsZSB8fCB0aGlzWyckZGF0YSddLCB0aGlzLCBudWxsLCBmdW5jdGlvbihzZWxmLCBwYXJlbnRDb250ZXh0KSB7XG4gICAgICAgICAgICAvLyBUaGlzIFwiY2hpbGRcIiBjb250ZXh0IGRvZXNuJ3QgZGlyZWN0bHkgdHJhY2sgYSBwYXJlbnQgb2JzZXJ2YWJsZSB2aWV3IG1vZGVsLFxuICAgICAgICAgICAgLy8gc28gd2UgbmVlZCB0byBtYW51YWxseSBzZXQgdGhlICRyYXdEYXRhIHZhbHVlIHRvIG1hdGNoIHRoZSBwYXJlbnQuXG4gICAgICAgICAgICBzZWxmWyckcmF3RGF0YSddID0gcGFyZW50Q29udGV4dFsnJHJhd0RhdGEnXTtcbiAgICAgICAgICAgIGtvLnV0aWxzLmV4dGVuZChzZWxmLCB0eXBlb2YocHJvcGVydGllcykgPT0gXCJmdW5jdGlvblwiID8gcHJvcGVydGllcygpIDogcHJvcGVydGllcyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBrby5iaW5kaW5nQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlU3RhdGljQ2hpbGRDb250ZXh0ID0gZnVuY3Rpb24gKGRhdGFJdGVtT3JBY2Nlc3NvciwgZGF0YUl0ZW1BbGlhcykge1xuICAgICAgICByZXR1cm4gdGhpc1snY3JlYXRlQ2hpbGRDb250ZXh0J10oZGF0YUl0ZW1PckFjY2Vzc29yLCBkYXRhSXRlbUFsaWFzLCBudWxsLCB7IFwiZXhwb3J0RGVwZW5kZW5jaWVzXCI6IHRydWUgfSk7XG4gICAgfTtcblxuICAgIC8vIFJldHVybnMgdGhlIHZhbHVlQWNjZXNvciBmdW5jdGlvbiBmb3IgYSBiaW5kaW5nIHZhbHVlXG4gICAgZnVuY3Rpb24gbWFrZVZhbHVlQWNjZXNzb3IodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIFJldHVybnMgdGhlIHZhbHVlIG9mIGEgdmFsdWVBY2Nlc3NvciBmdW5jdGlvblxuICAgIGZ1bmN0aW9uIGV2YWx1YXRlVmFsdWVBY2Nlc3Nvcih2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZUFjY2Vzc29yKCk7XG4gICAgfVxuXG4gICAgLy8gR2l2ZW4gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYmluZGluZ3MsIGNyZWF0ZSBhbmQgcmV0dXJuIGEgbmV3IG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAgLy8gYmluZGluZyB2YWx1ZS1hY2Nlc3NvcnMgZnVuY3Rpb25zLiBFYWNoIGFjY2Vzc29yIGZ1bmN0aW9uIGNhbGxzIHRoZSBvcmlnaW5hbCBmdW5jdGlvblxuICAgIC8vIHNvIHRoYXQgaXQgYWx3YXlzIGdldHMgdGhlIGxhdGVzdCB2YWx1ZSBhbmQgYWxsIGRlcGVuZGVuY2llcyBhcmUgY2FwdHVyZWQuIFRoaXMgaXMgdXNlZFxuICAgIC8vIGJ5IGtvLmFwcGx5QmluZGluZ3NUb05vZGUgYW5kIGdldEJpbmRpbmdzQW5kTWFrZUFjY2Vzc29ycy5cbiAgICBmdW5jdGlvbiBtYWtlQWNjZXNzb3JzRnJvbUZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBrby51dGlscy5vYmplY3RNYXAoa28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoY2FsbGJhY2spLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKClba2V5XTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEdpdmVuIGEgYmluZGluZ3MgZnVuY3Rpb24gb3Igb2JqZWN0LCBjcmVhdGUgYW5kIHJldHVybiBhIG5ldyBvYmplY3QgdGhhdCBjb250YWluc1xuICAgIC8vIGJpbmRpbmcgdmFsdWUtYWNjZXNzb3JzIGZ1bmN0aW9ucy4gVGhpcyBpcyB1c2VkIGJ5IGtvLmFwcGx5QmluZGluZ3NUb05vZGUuXG4gICAgZnVuY3Rpb24gbWFrZUJpbmRpbmdBY2Nlc3NvcnMoYmluZGluZ3MsIGNvbnRleHQsIG5vZGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiaW5kaW5ncyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG1ha2VBY2Nlc3NvcnNGcm9tRnVuY3Rpb24oYmluZGluZ3MuYmluZChudWxsLCBjb250ZXh0LCBub2RlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ga28udXRpbHMub2JqZWN0TWFwKGJpbmRpbmdzLCBtYWtlVmFsdWVBY2Nlc3Nvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgaWYgdGhlIGJpbmRpbmcgcHJvdmlkZXIgZG9lc24ndCBpbmNsdWRlIGEgZ2V0QmluZGluZ0FjY2Vzc29ycyBmdW5jdGlvbi5cbiAgICAvLyBJdCBtdXN0IGJlIGNhbGxlZCB3aXRoICd0aGlzJyBzZXQgdG8gdGhlIHByb3ZpZGVyIGluc3RhbmNlLlxuICAgIGZ1bmN0aW9uIGdldEJpbmRpbmdzQW5kTWFrZUFjY2Vzc29ycyhub2RlLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBtYWtlQWNjZXNzb3JzRnJvbUZ1bmN0aW9uKHRoaXNbJ2dldEJpbmRpbmdzJ10uYmluZCh0aGlzLCBub2RlLCBjb250ZXh0KSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVUaGF0QmluZGluZ0lzQWxsb3dlZEZvclZpcnR1YWxFbGVtZW50cyhiaW5kaW5nTmFtZSkge1xuICAgICAgICB2YXIgdmFsaWRhdG9yID0ga28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1tiaW5kaW5nTmFtZV07XG4gICAgICAgIGlmICghdmFsaWRhdG9yKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGJpbmRpbmcgJ1wiICsgYmluZGluZ05hbWUgKyBcIicgY2Fubm90IGJlIHVzZWQgd2l0aCB2aXJ0dWFsIGVsZW1lbnRzXCIpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHNJbnRlcm5hbCAoYmluZGluZ0NvbnRleHQsIGVsZW1lbnRPclZpcnR1YWxFbGVtZW50LCBiaW5kaW5nQ29udGV4dHNNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudCkge1xuICAgICAgICB2YXIgY3VycmVudENoaWxkLFxuICAgICAgICAgICAgbmV4dEluUXVldWUgPSBrby52aXJ0dWFsRWxlbWVudHMuZmlyc3RDaGlsZChlbGVtZW50T3JWaXJ0dWFsRWxlbWVudCksXG4gICAgICAgICAgICBwcm92aWRlciA9IGtvLmJpbmRpbmdQcm92aWRlclsnaW5zdGFuY2UnXSxcbiAgICAgICAgICAgIHByZXByb2Nlc3NOb2RlID0gcHJvdmlkZXJbJ3ByZXByb2Nlc3NOb2RlJ107XG5cbiAgICAgICAgLy8gUHJlcHJvY2Vzc2luZyBhbGxvd3MgYSBiaW5kaW5nIHByb3ZpZGVyIHRvIG11dGF0ZSBhIG5vZGUgYmVmb3JlIGJpbmRpbmdzIGFyZSBhcHBsaWVkIHRvIGl0LiBGb3IgZXhhbXBsZSBpdCdzXG4gICAgICAgIC8vIHBvc3NpYmxlIHRvIGluc2VydCBuZXcgc2libGluZ3MgYWZ0ZXIgaXQsIGFuZC9vciByZXBsYWNlIHRoZSBub2RlIHdpdGggYSBkaWZmZXJlbnQgb25lLiBUaGlzIGNhbiBiZSB1c2VkIHRvXG4gICAgICAgIC8vIGltcGxlbWVudCBjdXN0b20gYmluZGluZyBzeW50YXhlcywgc3VjaCBhcyB7eyB2YWx1ZSB9fSBmb3Igc3RyaW5nIGludGVycG9sYXRpb24sIG9yIGN1c3RvbSBlbGVtZW50IHR5cGVzIHRoYXRcbiAgICAgICAgLy8gdHJpZ2dlciBpbnNlcnRpb24gb2YgPHRlbXBsYXRlPiBjb250ZW50cyBhdCB0aGF0IHBvaW50IGluIHRoZSBkb2N1bWVudC5cbiAgICAgICAgaWYgKHByZXByb2Nlc3NOb2RlKSB7XG4gICAgICAgICAgICB3aGlsZSAoY3VycmVudENoaWxkID0gbmV4dEluUXVldWUpIHtcbiAgICAgICAgICAgICAgICBuZXh0SW5RdWV1ZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5uZXh0U2libGluZyhjdXJyZW50Q2hpbGQpO1xuICAgICAgICAgICAgICAgIHByZXByb2Nlc3NOb2RlLmNhbGwocHJvdmlkZXIsIGN1cnJlbnRDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBSZXNldCBuZXh0SW5RdWV1ZSBmb3IgdGhlIG5leHQgbG9vcFxuICAgICAgICAgICAgbmV4dEluUXVldWUgPSBrby52aXJ0dWFsRWxlbWVudHMuZmlyc3RDaGlsZChlbGVtZW50T3JWaXJ0dWFsRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoY3VycmVudENoaWxkID0gbmV4dEluUXVldWUpIHtcbiAgICAgICAgICAgIC8vIEtlZXAgYSByZWNvcmQgb2YgdGhlIG5leHQgY2hpbGQgKmJlZm9yZSogYXBwbHlpbmcgYmluZGluZ3MsIGluIGNhc2UgdGhlIGJpbmRpbmcgcmVtb3ZlcyB0aGUgY3VycmVudCBjaGlsZCBmcm9tIGl0cyBwb3NpdGlvblxuICAgICAgICAgICAgbmV4dEluUXVldWUgPSBrby52aXJ0dWFsRWxlbWVudHMubmV4dFNpYmxpbmcoY3VycmVudENoaWxkKTtcbiAgICAgICAgICAgIGFwcGx5QmluZGluZ3NUb05vZGVBbmREZXNjZW5kYW50c0ludGVybmFsKGJpbmRpbmdDb250ZXh0LCBjdXJyZW50Q2hpbGQsIGJpbmRpbmdDb250ZXh0c01heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGx5QmluZGluZ3NUb05vZGVBbmREZXNjZW5kYW50c0ludGVybmFsIChiaW5kaW5nQ29udGV4dCwgbm9kZVZlcmlmaWVkLCBiaW5kaW5nQ29udGV4dE1heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIHZhciBzaG91bGRCaW5kRGVzY2VuZGFudHMgPSB0cnVlO1xuXG4gICAgICAgIC8vIFBlcmYgb3B0aW1pc2F0aW9uOiBBcHBseSBiaW5kaW5ncyBvbmx5IGlmLi4uXG4gICAgICAgIC8vICgxKSBXZSBuZWVkIHRvIHN0b3JlIHRoZSBiaW5kaW5nIGNvbnRleHQgb24gdGhpcyBub2RlIChiZWNhdXNlIGl0IG1heSBkaWZmZXIgZnJvbSB0aGUgRE9NIHBhcmVudCBub2RlJ3MgYmluZGluZyBjb250ZXh0KVxuICAgICAgICAvLyAgICAgTm90ZSB0aGF0IHdlIGNhbid0IHN0b3JlIGJpbmRpbmcgY29udGV4dHMgb24gbm9uLWVsZW1lbnRzIChlLmcuLCB0ZXh0IG5vZGVzKSwgYXMgSUUgZG9lc24ndCBhbGxvdyBleHBhbmRvIHByb3BlcnRpZXMgZm9yIHRob3NlXG4gICAgICAgIC8vICgyKSBJdCBtaWdodCBoYXZlIGJpbmRpbmdzIChlLmcuLCBpdCBoYXMgYSBkYXRhLWJpbmQgYXR0cmlidXRlLCBvciBpdCdzIGEgbWFya2VyIGZvciBhIGNvbnRhaW5lcmxlc3MgdGVtcGxhdGUpXG4gICAgICAgIHZhciBpc0VsZW1lbnQgPSAobm9kZVZlcmlmaWVkLm5vZGVUeXBlID09PSAxKTtcbiAgICAgICAgaWYgKGlzRWxlbWVudCkgLy8gV29ya2Fyb3VuZCBJRSA8PSA4IEhUTUwgcGFyc2luZyB3ZWlyZG5lc3NcbiAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5ub3JtYWxpc2VWaXJ0dWFsRWxlbWVudERvbVN0cnVjdHVyZShub2RlVmVyaWZpZWQpO1xuXG4gICAgICAgIHZhciBzaG91bGRBcHBseUJpbmRpbmdzID0gKGlzRWxlbWVudCAmJiBiaW5kaW5nQ29udGV4dE1heURpZmZlckZyb21Eb21QYXJlbnRFbGVtZW50KSAgICAgICAgICAgICAvLyBDYXNlICgxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IGtvLmJpbmRpbmdQcm92aWRlclsnaW5zdGFuY2UnXVsnbm9kZUhhc0JpbmRpbmdzJ10obm9kZVZlcmlmaWVkKTsgICAgICAgLy8gQ2FzZSAoMilcbiAgICAgICAgaWYgKHNob3VsZEFwcGx5QmluZGluZ3MpXG4gICAgICAgICAgICBzaG91bGRCaW5kRGVzY2VuZGFudHMgPSBhcHBseUJpbmRpbmdzVG9Ob2RlSW50ZXJuYWwobm9kZVZlcmlmaWVkLCBudWxsLCBiaW5kaW5nQ29udGV4dCwgYmluZGluZ0NvbnRleHRNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudClbJ3Nob3VsZEJpbmREZXNjZW5kYW50cyddO1xuXG4gICAgICAgIGlmIChzaG91bGRCaW5kRGVzY2VuZGFudHMgJiYgIWJpbmRpbmdEb2VzTm90UmVjdXJzZUludG9FbGVtZW50VHlwZXNba28udXRpbHMudGFnTmFtZUxvd2VyKG5vZGVWZXJpZmllZCldKSB7XG4gICAgICAgICAgICAvLyBXZSdyZSByZWN1cnNpbmcgYXV0b21hdGljYWxseSBpbnRvIChyZWFsIG9yIHZpcnR1YWwpIGNoaWxkIG5vZGVzIHdpdGhvdXQgY2hhbmdpbmcgYmluZGluZyBjb250ZXh0cy4gU28sXG4gICAgICAgICAgICAvLyAgKiBGb3IgY2hpbGRyZW4gb2YgYSAqcmVhbCogZWxlbWVudCwgdGhlIGJpbmRpbmcgY29udGV4dCBpcyBjZXJ0YWlubHkgdGhlIHNhbWUgYXMgb24gdGhlaXIgRE9NIC5wYXJlbnROb2RlLFxuICAgICAgICAgICAgLy8gICAgaGVuY2UgYmluZGluZ0NvbnRleHRzTWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQgaXMgZmFsc2VcbiAgICAgICAgICAgIC8vICAqIEZvciBjaGlsZHJlbiBvZiBhICp2aXJ0dWFsKiBlbGVtZW50LCB3ZSBjYW4ndCBiZSBzdXJlLiBFdmFsdWF0aW5nIC5wYXJlbnROb2RlIG9uIHRob3NlIGNoaWxkcmVuIG1heVxuICAgICAgICAgICAgLy8gICAgc2tpcCBvdmVyIGFueSBudW1iZXIgb2YgaW50ZXJtZWRpYXRlIHZpcnR1YWwgZWxlbWVudHMsIGFueSBvZiB3aGljaCBtaWdodCBkZWZpbmUgYSBjdXN0b20gYmluZGluZyBjb250ZXh0LFxuICAgICAgICAgICAgLy8gICAgaGVuY2UgYmluZGluZ0NvbnRleHRzTWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQgaXMgdHJ1ZVxuICAgICAgICAgICAgYXBwbHlCaW5kaW5nc1RvRGVzY2VuZGFudHNJbnRlcm5hbChiaW5kaW5nQ29udGV4dCwgbm9kZVZlcmlmaWVkLCAvKiBiaW5kaW5nQ29udGV4dHNNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudDogKi8gIWlzRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYm91bmRFbGVtZW50RG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xuXG5cbiAgICBmdW5jdGlvbiB0b3BvbG9naWNhbFNvcnRCaW5kaW5ncyhiaW5kaW5ncykge1xuICAgICAgICAvLyBEZXB0aC1maXJzdCBzb3J0XG4gICAgICAgIHZhciByZXN1bHQgPSBbXSwgICAgICAgICAgICAgICAgLy8gVGhlIGxpc3Qgb2Yga2V5L2hhbmRsZXIgcGFpcnMgdGhhdCB3ZSB3aWxsIHJldHVyblxuICAgICAgICAgICAgYmluZGluZ3NDb25zaWRlcmVkID0ge30sICAgIC8vIEEgdGVtcG9yYXJ5IHJlY29yZCBvZiB3aGljaCBiaW5kaW5ncyBhcmUgYWxyZWFkeSBpbiAncmVzdWx0J1xuICAgICAgICAgICAgY3ljbGljRGVwZW5kZW5jeVN0YWNrID0gW107IC8vIEtlZXBzIHRyYWNrIG9mIGEgZGVwdGgtc2VhcmNoIHNvIHRoYXQsIGlmIHRoZXJlJ3MgYSBjeWNsZSwgd2Uga25vdyB3aGljaCBiaW5kaW5ncyBjYXVzZWQgaXRcbiAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaChiaW5kaW5ncywgZnVuY3Rpb24gcHVzaEJpbmRpbmcoYmluZGluZ0tleSkge1xuICAgICAgICAgICAgaWYgKCFiaW5kaW5nc0NvbnNpZGVyZWRbYmluZGluZ0tleV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgYmluZGluZyA9IGtvWydnZXRCaW5kaW5nSGFuZGxlciddKGJpbmRpbmdLZXkpO1xuICAgICAgICAgICAgICAgIGlmIChiaW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZpcnN0IGFkZCBkZXBlbmRlbmNpZXMgKGlmIGFueSkgb2YgdGhlIGN1cnJlbnQgYmluZGluZ1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmluZGluZ1snYWZ0ZXInXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3ljbGljRGVwZW5kZW5jeVN0YWNrLnB1c2goYmluZGluZ0tleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goYmluZGluZ1snYWZ0ZXInXSwgZnVuY3Rpb24oYmluZGluZ0RlcGVuZGVuY3lLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmluZGluZ3NbYmluZGluZ0RlcGVuZGVuY3lLZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrby51dGlscy5hcnJheUluZGV4T2YoY3ljbGljRGVwZW5kZW5jeVN0YWNrLCBiaW5kaW5nRGVwZW5kZW5jeUtleSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIkNhbm5vdCBjb21iaW5lIHRoZSBmb2xsb3dpbmcgYmluZGluZ3MsIGJlY2F1c2UgdGhleSBoYXZlIGEgY3ljbGljIGRlcGVuZGVuY3k6IFwiICsgY3ljbGljRGVwZW5kZW5jeVN0YWNrLmpvaW4oXCIsIFwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoQmluZGluZyhiaW5kaW5nRGVwZW5kZW5jeUtleSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN5Y2xpY0RlcGVuZGVuY3lTdGFjay5sZW5ndGgtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBOZXh0IGFkZCB0aGUgY3VycmVudCBiaW5kaW5nXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHsga2V5OiBiaW5kaW5nS2V5LCBoYW5kbGVyOiBiaW5kaW5nIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBiaW5kaW5nc0NvbnNpZGVyZWRbYmluZGluZ0tleV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGx5QmluZGluZ3NUb05vZGVJbnRlcm5hbChub2RlLCBzb3VyY2VCaW5kaW5ncywgYmluZGluZ0NvbnRleHQsIGJpbmRpbmdDb250ZXh0TWF5RGlmZmVyRnJvbURvbVBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgLy8gUHJldmVudCBtdWx0aXBsZSBhcHBseUJpbmRpbmdzIGNhbGxzIGZvciB0aGUgc2FtZSBub2RlLCBleGNlcHQgd2hlbiBhIGJpbmRpbmcgdmFsdWUgaXMgc3BlY2lmaWVkXG4gICAgICAgIHZhciBhbHJlYWR5Qm91bmQgPSBrby51dGlscy5kb21EYXRhLmdldChub2RlLCBib3VuZEVsZW1lbnREb21EYXRhS2V5KTtcbiAgICAgICAgaWYgKCFzb3VyY2VCaW5kaW5ncykge1xuICAgICAgICAgICAgaWYgKGFscmVhZHlCb3VuZCkge1xuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiWW91IGNhbm5vdCBhcHBseSBiaW5kaW5ncyBtdWx0aXBsZSB0aW1lcyB0byB0aGUgc2FtZSBlbGVtZW50LlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KG5vZGUsIGJvdW5kRWxlbWVudERvbURhdGFLZXksIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiBEb24ndCBzdG9yZSB0aGUgYmluZGluZyBjb250ZXh0IG9uIHRoaXMgbm9kZSBpZiBpdCdzIGRlZmluaXRlbHkgdGhlIHNhbWUgYXMgb24gbm9kZS5wYXJlbnROb2RlLCBiZWNhdXNlXG4gICAgICAgIC8vIHdlIGNhbiBlYXNpbHkgcmVjb3ZlciBpdCBqdXN0IGJ5IHNjYW5uaW5nIHVwIHRoZSBub2RlJ3MgYW5jZXN0b3JzIGluIHRoZSBET01cbiAgICAgICAgLy8gKG5vdGU6IGhlcmUsIHBhcmVudCBub2RlIG1lYW5zIFwicmVhbCBET00gcGFyZW50XCIgbm90IFwidmlydHVhbCBwYXJlbnRcIiwgYXMgdGhlcmUncyBubyBPKDEpIHdheSB0byBmaW5kIHRoZSB2aXJ0dWFsIHBhcmVudClcbiAgICAgICAgaWYgKCFhbHJlYWR5Qm91bmQgJiYgYmluZGluZ0NvbnRleHRNYXlEaWZmZXJGcm9tRG9tUGFyZW50RWxlbWVudClcbiAgICAgICAgICAgIGtvLnN0b3JlZEJpbmRpbmdDb250ZXh0Rm9yTm9kZShub2RlLCBiaW5kaW5nQ29udGV4dCk7XG5cbiAgICAgICAgLy8gVXNlIGJpbmRpbmdzIGlmIGdpdmVuLCBvdGhlcndpc2UgZmFsbCBiYWNrIG9uIGFza2luZyB0aGUgYmluZGluZ3MgcHJvdmlkZXIgdG8gZ2l2ZSB1cyBzb21lIGJpbmRpbmdzXG4gICAgICAgIHZhciBiaW5kaW5ncztcbiAgICAgICAgaWYgKHNvdXJjZUJpbmRpbmdzICYmIHR5cGVvZiBzb3VyY2VCaW5kaW5ncyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYmluZGluZ3MgPSBzb3VyY2VCaW5kaW5ncztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBwcm92aWRlciA9IGtvLmJpbmRpbmdQcm92aWRlclsnaW5zdGFuY2UnXSxcbiAgICAgICAgICAgICAgICBnZXRCaW5kaW5ncyA9IHByb3ZpZGVyWydnZXRCaW5kaW5nQWNjZXNzb3JzJ10gfHwgZ2V0QmluZGluZ3NBbmRNYWtlQWNjZXNzb3JzO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGJpbmRpbmcgZnJvbSB0aGUgcHJvdmlkZXIgd2l0aGluIGEgY29tcHV0ZWQgb2JzZXJ2YWJsZSBzbyB0aGF0IHdlIGNhbiB1cGRhdGUgdGhlIGJpbmRpbmdzIHdoZW5ldmVyXG4gICAgICAgICAgICAvLyB0aGUgYmluZGluZyBjb250ZXh0IGlzIHVwZGF0ZWQgb3IgaWYgdGhlIGJpbmRpbmcgcHJvdmlkZXIgYWNjZXNzZXMgb2JzZXJ2YWJsZXMuXG4gICAgICAgICAgICB2YXIgYmluZGluZ3NVcGRhdGVyID0ga28uZGVwZW5kZW50T2JzZXJ2YWJsZShcbiAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZ3MgPSBzb3VyY2VCaW5kaW5ncyA/IHNvdXJjZUJpbmRpbmdzKGJpbmRpbmdDb250ZXh0LCBub2RlKSA6IGdldEJpbmRpbmdzLmNhbGwocHJvdmlkZXIsIG5vZGUsIGJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVnaXN0ZXIgYSBkZXBlbmRlbmN5IG9uIHRoZSBiaW5kaW5nIGNvbnRleHQgdG8gc3VwcG9ydCBvYnNlcnZhYmxlIHZpZXcgbW9kZWxzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoYmluZGluZ3MgJiYgYmluZGluZ0NvbnRleHQuX3N1YnNjcmliYWJsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRpbmdDb250ZXh0Ll9zdWJzY3JpYmFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmdzO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IG5vZGUgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKCFiaW5kaW5ncyB8fCAhYmluZGluZ3NVcGRhdGVyLmlzQWN0aXZlKCkpXG4gICAgICAgICAgICAgICAgYmluZGluZ3NVcGRhdGVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBiaW5kaW5nSGFuZGxlclRoYXRDb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncztcbiAgICAgICAgaWYgKGJpbmRpbmdzKSB7XG4gICAgICAgICAgICAvLyBSZXR1cm4gdGhlIHZhbHVlIGFjY2Vzc29yIGZvciBhIGdpdmVuIGJpbmRpbmcuIFdoZW4gYmluZGluZ3MgYXJlIHN0YXRpYyAod29uJ3QgYmUgdXBkYXRlZCBiZWNhdXNlIG9mIGEgYmluZGluZ1xuICAgICAgICAgICAgLy8gY29udGV4dCB1cGRhdGUpLCBqdXN0IHJldHVybiB0aGUgdmFsdWUgYWNjZXNzb3IgZnJvbSB0aGUgYmluZGluZy4gT3RoZXJ3aXNlLCByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGFsd2F5cyBnZXRzXG4gICAgICAgICAgICAvLyB0aGUgbGF0ZXN0IGJpbmRpbmcgdmFsdWUgYW5kIHJlZ2lzdGVycyBhIGRlcGVuZGVuY3kgb24gdGhlIGJpbmRpbmcgdXBkYXRlci5cbiAgICAgICAgICAgIHZhciBnZXRWYWx1ZUFjY2Vzc29yID0gYmluZGluZ3NVcGRhdGVyXG4gICAgICAgICAgICAgICAgPyBmdW5jdGlvbihiaW5kaW5nS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBldmFsdWF0ZVZhbHVlQWNjZXNzb3IoYmluZGluZ3NVcGRhdGVyKClbYmluZGluZ0tleV0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gOiBmdW5jdGlvbihiaW5kaW5nS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiaW5kaW5nc1tiaW5kaW5nS2V5XTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBVc2Ugb2YgYWxsQmluZGluZ3MgYXMgYSBmdW5jdGlvbiBpcyBtYWludGFpbmVkIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSwgYnV0IGl0cyB1c2UgaXMgZGVwcmVjYXRlZFxuICAgICAgICAgICAgZnVuY3Rpb24gYWxsQmluZGluZ3MoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLm9iamVjdE1hcChiaW5kaW5nc1VwZGF0ZXIgPyBiaW5kaW5nc1VwZGF0ZXIoKSA6IGJpbmRpbmdzLCBldmFsdWF0ZVZhbHVlQWNjZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBpcyB0aGUgMy54IGFsbEJpbmRpbmdzIEFQSVxuICAgICAgICAgICAgYWxsQmluZGluZ3NbJ2dldCddID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpbmRpbmdzW2tleV0gJiYgZXZhbHVhdGVWYWx1ZUFjY2Vzc29yKGdldFZhbHVlQWNjZXNzb3Ioa2V5KSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWxsQmluZGluZ3NbJ2hhcyddID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleSBpbiBiaW5kaW5ncztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIEZpcnN0IHB1dCB0aGUgYmluZGluZ3MgaW50byB0aGUgcmlnaHQgb3JkZXJcbiAgICAgICAgICAgIHZhciBvcmRlcmVkQmluZGluZ3MgPSB0b3BvbG9naWNhbFNvcnRCaW5kaW5ncyhiaW5kaW5ncyk7XG5cbiAgICAgICAgICAgIC8vIEdvIHRocm91Z2ggdGhlIHNvcnRlZCBiaW5kaW5ncywgY2FsbGluZyBpbml0IGFuZCB1cGRhdGUgZm9yIGVhY2hcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChvcmRlcmVkQmluZGluZ3MsIGZ1bmN0aW9uKGJpbmRpbmdLZXlBbmRIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgLy8gTm90ZSB0aGF0IHRvcG9sb2dpY2FsU29ydEJpbmRpbmdzIGhhcyBhbHJlYWR5IGZpbHRlcmVkIG91dCBhbnkgbm9uZXhpc3RlbnQgYmluZGluZyBoYW5kbGVycyxcbiAgICAgICAgICAgICAgICAvLyBzbyBiaW5kaW5nS2V5QW5kSGFuZGxlci5oYW5kbGVyIHdpbGwgYWx3YXlzIGJlIG5vbm51bGwuXG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZXJJbml0Rm4gPSBiaW5kaW5nS2V5QW5kSGFuZGxlci5oYW5kbGVyW1wiaW5pdFwiXSxcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlclVwZGF0ZUZuID0gYmluZGluZ0tleUFuZEhhbmRsZXIuaGFuZGxlcltcInVwZGF0ZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgYmluZGluZ0tleSA9IGJpbmRpbmdLZXlBbmRIYW5kbGVyLmtleTtcblxuICAgICAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlVGhhdEJpbmRpbmdJc0FsbG93ZWRGb3JWaXJ0dWFsRWxlbWVudHMoYmluZGluZ0tleSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUnVuIGluaXQsIGlnbm9yaW5nIGFueSBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVySW5pdEZuID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluaXRSZXN1bHQgPSBoYW5kbGVySW5pdEZuKG5vZGUsIGdldFZhbHVlQWNjZXNzb3IoYmluZGluZ0tleSksIGFsbEJpbmRpbmdzLCBiaW5kaW5nQ29udGV4dFsnJGRhdGEnXSwgYmluZGluZ0NvbnRleHQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBiaW5kaW5nIGhhbmRsZXIgY2xhaW1zIHRvIGNvbnRyb2wgZGVzY2VuZGFudCBiaW5kaW5ncywgbWFrZSBhIG5vdGUgb2YgdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbml0UmVzdWx0ICYmIGluaXRSZXN1bHRbJ2NvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJpbmRpbmdIYW5kbGVyVGhhdENvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdWx0aXBsZSBiaW5kaW5ncyAoXCIgKyBiaW5kaW5nSGFuZGxlclRoYXRDb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyArIFwiIGFuZCBcIiArIGJpbmRpbmdLZXkgKyBcIikgYXJlIHRyeWluZyB0byBjb250cm9sIGRlc2NlbmRhbnQgYmluZGluZ3Mgb2YgdGhlIHNhbWUgZWxlbWVudC4gWW91IGNhbm5vdCB1c2UgdGhlc2UgYmluZGluZ3MgdG9nZXRoZXIgb24gdGhlIHNhbWUgZWxlbWVudC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRpbmdIYW5kbGVyVGhhdENvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzID0gYmluZGluZ0tleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biB1cGRhdGUgaW4gaXRzIG93biBjb21wdXRlZCB3cmFwcGVyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlclVwZGF0ZUZuID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAga28uZGVwZW5kZW50T2JzZXJ2YWJsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlclVwZGF0ZUZuKG5vZGUsIGdldFZhbHVlQWNjZXNzb3IoYmluZGluZ0tleSksIGFsbEJpbmRpbmdzLCBiaW5kaW5nQ29udGV4dFsnJGRhdGEnXSwgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogbm9kZSB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZXgubWVzc2FnZSA9IFwiVW5hYmxlIHRvIHByb2Nlc3MgYmluZGluZyBcXFwiXCIgKyBiaW5kaW5nS2V5ICsgXCI6IFwiICsgYmluZGluZ3NbYmluZGluZ0tleV0gKyBcIlxcXCJcXG5NZXNzYWdlOiBcIiArIGV4Lm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdzaG91bGRCaW5kRGVzY2VuZGFudHMnOiBiaW5kaW5nSGFuZGxlclRoYXRDb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyA9PT0gdW5kZWZpbmVkXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBzdG9yZWRCaW5kaW5nQ29udGV4dERvbURhdGFLZXkgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcbiAgICBrby5zdG9yZWRCaW5kaW5nQ29udGV4dEZvck5vZGUgPSBmdW5jdGlvbiAobm9kZSwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQobm9kZSwgc3RvcmVkQmluZGluZ0NvbnRleHREb21EYXRhS2V5LCBiaW5kaW5nQ29udGV4dCk7XG4gICAgICAgICAgICBpZiAoYmluZGluZ0NvbnRleHQuX3N1YnNjcmliYWJsZSlcbiAgICAgICAgICAgICAgICBiaW5kaW5nQ29udGV4dC5fc3Vic2NyaWJhYmxlLl9hZGROb2RlKG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmRvbURhdGEuZ2V0KG5vZGUsIHN0b3JlZEJpbmRpbmdDb250ZXh0RG9tRGF0YUtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCaW5kaW5nQ29udGV4dCh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIHJldHVybiB2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0ICYmICh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0IGluc3RhbmNlb2Yga28uYmluZGluZ0NvbnRleHQpXG4gICAgICAgICAgICA/IHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHRcbiAgICAgICAgICAgIDogbmV3IGtvLmJpbmRpbmdDb250ZXh0KHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpO1xuICAgIH1cblxuICAgIGtvLmFwcGx5QmluZGluZ0FjY2Vzc29yc1RvTm9kZSA9IGZ1bmN0aW9uIChub2RlLCBiaW5kaW5ncywgdmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCkge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkgLy8gSWYgaXQncyBhbiBlbGVtZW50LCB3b3JrYXJvdW5kIElFIDw9IDggSFRNTCBwYXJzaW5nIHdlaXJkbmVzc1xuICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLm5vcm1hbGlzZVZpcnR1YWxFbGVtZW50RG9tU3RydWN0dXJlKG5vZGUpO1xuICAgICAgICByZXR1cm4gYXBwbHlCaW5kaW5nc1RvTm9kZUludGVybmFsKG5vZGUsIGJpbmRpbmdzLCBnZXRCaW5kaW5nQ29udGV4dCh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIGtvLmFwcGx5QmluZGluZ3NUb05vZGUgPSBmdW5jdGlvbiAobm9kZSwgYmluZGluZ3MsIHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgdmFyIGNvbnRleHQgPSBnZXRCaW5kaW5nQ29udGV4dCh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0KTtcbiAgICAgICAgcmV0dXJuIGtvLmFwcGx5QmluZGluZ0FjY2Vzc29yc1RvTm9kZShub2RlLCBtYWtlQmluZGluZ0FjY2Vzc29ycyhiaW5kaW5ncywgY29udGV4dCwgbm9kZSksIGNvbnRleHQpO1xuICAgIH07XG5cbiAgICBrby5hcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyA9IGZ1bmN0aW9uKHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQsIHJvb3ROb2RlKSB7XG4gICAgICAgIGlmIChyb290Tm9kZS5ub2RlVHlwZSA9PT0gMSB8fCByb290Tm9kZS5ub2RlVHlwZSA9PT0gOClcbiAgICAgICAgICAgIGFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzSW50ZXJuYWwoZ2V0QmluZGluZ0NvbnRleHQodmlld01vZGVsT3JCaW5kaW5nQ29udGV4dCksIHJvb3ROb2RlLCB0cnVlKTtcbiAgICB9O1xuXG4gICAga28uYXBwbHlCaW5kaW5ncyA9IGZ1bmN0aW9uICh2aWV3TW9kZWxPckJpbmRpbmdDb250ZXh0LCByb290Tm9kZSkge1xuICAgICAgICAvLyBJZiBqUXVlcnkgaXMgbG9hZGVkIGFmdGVyIEtub2Nrb3V0LCB3ZSB3b24ndCBpbml0aWFsbHkgaGF2ZSBhY2Nlc3MgdG8gaXQuIFNvIHNhdmUgaXQgaGVyZS5cbiAgICAgICAgaWYgKCFqUXVlcnlJbnN0YW5jZSAmJiB3aW5kb3dbJ2pRdWVyeSddKSB7XG4gICAgICAgICAgICBqUXVlcnlJbnN0YW5jZSA9IHdpbmRvd1snalF1ZXJ5J107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocm9vdE5vZGUgJiYgKHJvb3ROb2RlLm5vZGVUeXBlICE9PSAxKSAmJiAocm9vdE5vZGUubm9kZVR5cGUgIT09IDgpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwia28uYXBwbHlCaW5kaW5nczogZmlyc3QgcGFyYW1ldGVyIHNob3VsZCBiZSB5b3VyIHZpZXcgbW9kZWw7IHNlY29uZCBwYXJhbWV0ZXIgc2hvdWxkIGJlIGEgRE9NIG5vZGVcIik7XG4gICAgICAgIHJvb3ROb2RlID0gcm9vdE5vZGUgfHwgd2luZG93LmRvY3VtZW50LmJvZHk7IC8vIE1ha2UgXCJyb290Tm9kZVwiIHBhcmFtZXRlciBvcHRpb25hbFxuXG4gICAgICAgIGFwcGx5QmluZGluZ3NUb05vZGVBbmREZXNjZW5kYW50c0ludGVybmFsKGdldEJpbmRpbmdDb250ZXh0KHZpZXdNb2RlbE9yQmluZGluZ0NvbnRleHQpLCByb290Tm9kZSwgdHJ1ZSk7XG4gICAgfTtcblxuICAgIC8vIFJldHJpZXZpbmcgYmluZGluZyBjb250ZXh0IGZyb20gYXJiaXRyYXJ5IG5vZGVzXG4gICAga28uY29udGV4dEZvciA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgLy8gV2UgY2FuIG9ubHkgZG8gc29tZXRoaW5nIG1lYW5pbmdmdWwgZm9yIGVsZW1lbnRzIGFuZCBjb21tZW50IG5vZGVzIChpbiBwYXJ0aWN1bGFyLCBub3QgdGV4dCBub2RlcywgYXMgSUUgY2FuJ3Qgc3RvcmUgZG9tZGF0YSBmb3IgdGhlbSlcbiAgICAgICAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBrby5zdG9yZWRCaW5kaW5nQ29udGV4dEZvck5vZGUobm9kZSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHQpIHJldHVybiBjb250ZXh0O1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnBhcmVudE5vZGUpIHJldHVybiBrby5jb250ZXh0Rm9yKG5vZGUucGFyZW50Tm9kZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIGtvLmRhdGFGb3IgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHZhciBjb250ZXh0ID0ga28uY29udGV4dEZvcihub2RlKTtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQgPyBjb250ZXh0WyckZGF0YSddIDogdW5kZWZpbmVkO1xuICAgIH07XG5cbiAgICBrby5leHBvcnRTeW1ib2woJ2JpbmRpbmdIYW5kbGVycycsIGtvLmJpbmRpbmdIYW5kbGVycyk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdhcHBseUJpbmRpbmdzJywga28uYXBwbHlCaW5kaW5ncyk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdhcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cycsIGtvLmFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2FwcGx5QmluZGluZ0FjY2Vzc29yc1RvTm9kZScsIGtvLmFwcGx5QmluZGluZ0FjY2Vzc29yc1RvTm9kZSk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdhcHBseUJpbmRpbmdzVG9Ob2RlJywga28uYXBwbHlCaW5kaW5nc1RvTm9kZSk7XG4gICAga28uZXhwb3J0U3ltYm9sKCdjb250ZXh0Rm9yJywga28uY29udGV4dEZvcik7XG4gICAga28uZXhwb3J0U3ltYm9sKCdkYXRhRm9yJywga28uZGF0YUZvcik7XG59KSgpO1xuKGZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuICAgIHZhciBsb2FkaW5nU3Vic2NyaWJhYmxlc0NhY2hlID0ge30sIC8vIFRyYWNrcyBjb21wb25lbnQgbG9hZHMgdGhhdCBhcmUgY3VycmVudGx5IGluIGZsaWdodFxuICAgICAgICBsb2FkZWREZWZpbml0aW9uc0NhY2hlID0ge307ICAgIC8vIFRyYWNrcyBjb21wb25lbnQgbG9hZHMgdGhhdCBoYXZlIGFscmVhZHkgY29tcGxldGVkXG5cbiAgICBrby5jb21wb25lbnRzID0ge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgY2FjaGVkRGVmaW5pdGlvbiA9IGdldE9iamVjdE93blByb3BlcnR5KGxvYWRlZERlZmluaXRpb25zQ2FjaGUsIGNvbXBvbmVudE5hbWUpO1xuICAgICAgICAgICAgaWYgKGNhY2hlZERlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICAvLyBJdCdzIGFscmVhZHkgbG9hZGVkIGFuZCBjYWNoZWQuIFJldXNlIHRoZSBzYW1lIGRlZmluaXRpb24gb2JqZWN0LlxuICAgICAgICAgICAgICAgIC8vIE5vdGUgdGhhdCBmb3IgQVBJIGNvbnNpc3RlbmN5LCBldmVuIGNhY2hlIGhpdHMgY29tcGxldGUgYXN5bmNocm9ub3VzbHkgYnkgZGVmYXVsdC5cbiAgICAgICAgICAgICAgICAvLyBZb3UgY2FuIGJ5cGFzcyB0aGlzIGJ5IHB1dHRpbmcgc3luY2hyb25vdXM6dHJ1ZSBvbiB5b3VyIGNvbXBvbmVudCBjb25maWcuXG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlZERlZmluaXRpb24uaXNTeW5jaHJvbm91c0NvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShmdW5jdGlvbigpIHsgLy8gU2VlIGNvbW1lbnQgaW4gbG9hZGVyUmVnaXN0cnlCZWhhdmlvcnMuanMgZm9yIHJlYXNvbmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soY2FjaGVkRGVmaW5pdGlvbi5kZWZpbml0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAga28udGFza3Muc2NoZWR1bGUoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKGNhY2hlZERlZmluaXRpb24uZGVmaW5pdGlvbik7IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSm9pbiB0aGUgbG9hZGluZyBwcm9jZXNzIHRoYXQgaXMgYWxyZWFkeSB1bmRlcndheSwgb3Igc3RhcnQgYSBuZXcgb25lLlxuICAgICAgICAgICAgICAgIGxvYWRDb21wb25lbnRBbmROb3RpZnkoY29tcG9uZW50TmFtZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNsZWFyQ2FjaGVkRGVmaW5pdGlvbjogZnVuY3Rpb24oY29tcG9uZW50TmFtZSkge1xuICAgICAgICAgICAgZGVsZXRlIGxvYWRlZERlZmluaXRpb25zQ2FjaGVbY29tcG9uZW50TmFtZV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2dldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnM6IGdldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnNcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0T2JqZWN0T3duUHJvcGVydHkob2JqLCBwcm9wTmFtZSkge1xuICAgICAgICByZXR1cm4gb2JqLmhhc093blByb3BlcnR5KHByb3BOYW1lKSA/IG9ialtwcm9wTmFtZV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZENvbXBvbmVudEFuZE5vdGlmeShjb21wb25lbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgc3Vic2NyaWJhYmxlID0gZ2V0T2JqZWN0T3duUHJvcGVydHkobG9hZGluZ1N1YnNjcmliYWJsZXNDYWNoZSwgY29tcG9uZW50TmFtZSksXG4gICAgICAgICAgICBjb21wbGV0ZWRBc3luYztcbiAgICAgICAgaWYgKCFzdWJzY3JpYmFibGUpIHtcbiAgICAgICAgICAgIC8vIEl0J3Mgbm90IHN0YXJ0ZWQgbG9hZGluZyB5ZXQuIFN0YXJ0IGxvYWRpbmcsIGFuZCB3aGVuIGl0J3MgZG9uZSwgbW92ZSBpdCB0byBsb2FkZWREZWZpbml0aW9uc0NhY2hlLlxuICAgICAgICAgICAgc3Vic2NyaWJhYmxlID0gbG9hZGluZ1N1YnNjcmliYWJsZXNDYWNoZVtjb21wb25lbnROYW1lXSA9IG5ldyBrby5zdWJzY3JpYmFibGUoKTtcbiAgICAgICAgICAgIHN1YnNjcmliYWJsZS5zdWJzY3JpYmUoY2FsbGJhY2spO1xuXG4gICAgICAgICAgICBiZWdpbkxvYWRpbmdDb21wb25lbnQoY29tcG9uZW50TmFtZSwgZnVuY3Rpb24oZGVmaW5pdGlvbiwgY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzU3luY2hyb25vdXNDb21wb25lbnQgPSAhIShjb25maWcgJiYgY29uZmlnWydzeW5jaHJvbm91cyddKTtcbiAgICAgICAgICAgICAgICBsb2FkZWREZWZpbml0aW9uc0NhY2hlW2NvbXBvbmVudE5hbWVdID0geyBkZWZpbml0aW9uOiBkZWZpbml0aW9uLCBpc1N5bmNocm9ub3VzQ29tcG9uZW50OiBpc1N5bmNocm9ub3VzQ29tcG9uZW50IH07XG4gICAgICAgICAgICAgICAgZGVsZXRlIGxvYWRpbmdTdWJzY3JpYmFibGVzQ2FjaGVbY29tcG9uZW50TmFtZV07XG5cbiAgICAgICAgICAgICAgICAvLyBGb3IgQVBJIGNvbnNpc3RlbmN5LCBhbGwgbG9hZHMgY29tcGxldGUgYXN5bmNocm9ub3VzbHkuIEhvd2V2ZXIgd2Ugd2FudCB0byBhdm9pZFxuICAgICAgICAgICAgICAgIC8vIGFkZGluZyBhbiBleHRyYSB0YXNrIHNjaGVkdWxlIGlmIGl0J3MgdW5uZWNlc3NhcnkgKGkuZS4sIHRoZSBjb21wbGV0aW9uIGlzIGFscmVhZHlcbiAgICAgICAgICAgICAgICAvLyBhc3luYykuXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyBZb3UgY2FuIGJ5cGFzcyB0aGUgJ2Fsd2F5cyBhc3luY2hyb25vdXMnIGZlYXR1cmUgYnkgcHV0dGluZyB0aGUgc3luY2hyb25vdXM6dHJ1ZVxuICAgICAgICAgICAgICAgIC8vIGZsYWcgb24geW91ciBjb21wb25lbnQgY29uZmlndXJhdGlvbiB3aGVuIHlvdSByZWdpc3RlciBpdC5cbiAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVkQXN5bmMgfHwgaXNTeW5jaHJvbm91c0NvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBOb3RlIHRoYXQgbm90aWZ5U3Vic2NyaWJlcnMgaWdub3JlcyBhbnkgZGVwZW5kZW5jaWVzIHJlYWQgd2l0aGluIHRoZSBjYWxsYmFjay5cbiAgICAgICAgICAgICAgICAgICAgLy8gU2VlIGNvbW1lbnQgaW4gbG9hZGVyUmVnaXN0cnlCZWhhdmlvcnMuanMgZm9yIHJlYXNvbmluZ1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmFibGVbJ25vdGlmeVN1YnNjcmliZXJzJ10oZGVmaW5pdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAga28udGFza3Muc2NoZWR1bGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmFibGVbJ25vdGlmeVN1YnNjcmliZXJzJ10oZGVmaW5pdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29tcGxldGVkQXN5bmMgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3Vic2NyaWJhYmxlLnN1YnNjcmliZShjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBiZWdpbkxvYWRpbmdDb21wb25lbnQoY29tcG9uZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVycygnZ2V0Q29uZmlnJywgW2NvbXBvbmVudE5hbWVdLCBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgICAgICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIGEgY29uZmlnLCBzbyBub3cgbG9hZCBpdHMgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIGdldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnMoJ2xvYWRDb21wb25lbnQnLCBbY29tcG9uZW50TmFtZSwgY29uZmlnXSwgZnVuY3Rpb24oZGVmaW5pdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhkZWZpbml0aW9uLCBjb25maWcpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgY29tcG9uZW50IGhhcyBubyBjb25maWcgLSBpdCdzIHVua25vd24gdG8gYWxsIHRoZSBsb2FkZXJzLlxuICAgICAgICAgICAgICAgIC8vIE5vdGUgdGhhdCB0aGlzIGlzIG5vdCBhbiBlcnJvciAoZS5nLiwgYSBtb2R1bGUgbG9hZGluZyBlcnJvcikgLSB0aGF0IHdvdWxkIGFib3J0IHRoZVxuICAgICAgICAgICAgICAgIC8vIHByb2Nlc3MgYW5kIHRoaXMgY2FsbGJhY2sgd291bGQgbm90IHJ1bi4gRm9yIHRoaXMgY2FsbGJhY2sgdG8gcnVuLCBhbGwgbG9hZGVycyBtdXN0XG4gICAgICAgICAgICAgICAgLy8gaGF2ZSBjb25maXJtZWQgdGhleSBkb24ndCBrbm93IGFib3V0IHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzKG1ldGhvZE5hbWUsIGFyZ3NFeGNlcHRDYWxsYmFjaywgY2FsbGJhY2ssIGNhbmRpZGF0ZUxvYWRlcnMpIHtcbiAgICAgICAgLy8gT24gdGhlIGZpcnN0IGNhbGwgaW4gdGhlIHN0YWNrLCBzdGFydCB3aXRoIHRoZSBmdWxsIHNldCBvZiBsb2FkZXJzXG4gICAgICAgIGlmICghY2FuZGlkYXRlTG9hZGVycykge1xuICAgICAgICAgICAgY2FuZGlkYXRlTG9hZGVycyA9IGtvLmNvbXBvbmVudHNbJ2xvYWRlcnMnXS5zbGljZSgwKTsgLy8gVXNlIGEgY29weSwgYmVjYXVzZSB3ZSdsbCBiZSBtdXRhdGluZyB0aGlzIGFycmF5XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUcnkgdGhlIG5leHQgY2FuZGlkYXRlXG4gICAgICAgIHZhciBjdXJyZW50Q2FuZGlkYXRlTG9hZGVyID0gY2FuZGlkYXRlTG9hZGVycy5zaGlmdCgpO1xuICAgICAgICBpZiAoY3VycmVudENhbmRpZGF0ZUxvYWRlcikge1xuICAgICAgICAgICAgdmFyIG1ldGhvZEluc3RhbmNlID0gY3VycmVudENhbmRpZGF0ZUxvYWRlclttZXRob2ROYW1lXTtcbiAgICAgICAgICAgIGlmIChtZXRob2RJbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIHZhciB3YXNBYm9ydGVkID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHN5bmNocm9ub3VzUmV0dXJuVmFsdWUgPSBtZXRob2RJbnN0YW5jZS5hcHBseShjdXJyZW50Q2FuZGlkYXRlTG9hZGVyLCBhcmdzRXhjZXB0Q2FsbGJhY2suY29uY2F0KGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdhc0Fib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBjYW5kaWRhdGUgcmV0dXJuZWQgYSB2YWx1ZS4gVXNlIGl0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRyeSB0aGUgbmV4dCBjYW5kaWRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzKG1ldGhvZE5hbWUsIGFyZ3NFeGNlcHRDYWxsYmFjaywgY2FsbGJhY2ssIGNhbmRpZGF0ZUxvYWRlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgICAvLyBDdXJyZW50bHksIGxvYWRlcnMgbWF5IG5vdCByZXR1cm4gYW55dGhpbmcgc3luY2hyb25vdXNseS4gVGhpcyBsZWF2ZXMgb3BlbiB0aGUgcG9zc2liaWxpdHlcbiAgICAgICAgICAgICAgICAvLyB0aGF0IHdlJ2xsIGV4dGVuZCB0aGUgQVBJIHRvIHN1cHBvcnQgc3luY2hyb25vdXMgcmV0dXJuIHZhbHVlcyBpbiB0aGUgZnV0dXJlLiBJdCB3b24ndCBiZVxuICAgICAgICAgICAgICAgIC8vIGEgYnJlYWtpbmcgY2hhbmdlLCBiZWNhdXNlIGN1cnJlbnRseSBubyBsb2FkZXIgaXMgYWxsb3dlZCB0byByZXR1cm4gYW55dGhpbmcgZXhjZXB0IHVuZGVmaW5lZC5cbiAgICAgICAgICAgICAgICBpZiAoc3luY2hyb25vdXNSZXR1cm5WYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhc0Fib3J0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE1ldGhvZCB0byBzdXBwcmVzcyBleGNlcHRpb25zIHdpbGwgcmVtYWluIHVuZG9jdW1lbnRlZC4gVGhpcyBpcyBvbmx5IHRvIGtlZXBcbiAgICAgICAgICAgICAgICAgICAgLy8gS08ncyBzcGVjcyBydW5uaW5nIHRpZGlseSwgc2luY2Ugd2UgY2FuIG9ic2VydmUgdGhlIGxvYWRpbmcgZ290IGFib3J0ZWQgd2l0aG91dFxuICAgICAgICAgICAgICAgICAgICAvLyBoYXZpbmcgZXhjZXB0aW9ucyBjbHV0dGVyaW5nIHVwIHRoZSBjb25zb2xlIHRvby5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjdXJyZW50Q2FuZGlkYXRlTG9hZGVyWydzdXBwcmVzc0xvYWRlckV4Y2VwdGlvbnMnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgbG9hZGVycyBtdXN0IHN1cHBseSB2YWx1ZXMgYnkgaW52b2tpbmcgdGhlIGNhbGxiYWNrLCBub3QgYnkgcmV0dXJuaW5nIHZhbHVlcyBzeW5jaHJvbm91c2x5LicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGNhbmRpZGF0ZSBkb2Vzbid0IGhhdmUgdGhlIHJlbGV2YW50IGhhbmRsZXIuIFN5bmNocm9ub3VzbHkgbW92ZSBvbiB0byB0aGUgbmV4dCBvbmUuXG4gICAgICAgICAgICAgICAgZ2V0Rmlyc3RSZXN1bHRGcm9tTG9hZGVycyhtZXRob2ROYW1lLCBhcmdzRXhjZXB0Q2FsbGJhY2ssIGNhbGxiYWNrLCBjYW5kaWRhdGVMb2FkZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vIGNhbmRpZGF0ZXMgcmV0dXJuZWQgYSB2YWx1ZVxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZWZlcmVuY2UgdGhlIGxvYWRlcnMgdmlhIHN0cmluZyBuYW1lIHNvIGl0J3MgcG9zc2libGUgZm9yIGRldmVsb3BlcnNcbiAgICAvLyB0byByZXBsYWNlIHRoZSB3aG9sZSBhcnJheSBieSBhc3NpZ25pbmcgdG8ga28uY29tcG9uZW50cy5sb2FkZXJzXG4gICAga28uY29tcG9uZW50c1snbG9hZGVycyddID0gW107XG5cbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMnLCBrby5jb21wb25lbnRzKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMuZ2V0Jywga28uY29tcG9uZW50cy5nZXQpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnY29tcG9uZW50cy5jbGVhckNhY2hlZERlZmluaXRpb24nLCBrby5jb21wb25lbnRzLmNsZWFyQ2FjaGVkRGVmaW5pdGlvbik7XG59KSgpO1xuKGZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuXG4gICAgLy8gVGhlIGRlZmF1bHQgbG9hZGVyIGlzIHJlc3BvbnNpYmxlIGZvciB0d28gdGhpbmdzOlxuICAgIC8vIDEuIE1haW50YWluaW5nIHRoZSBkZWZhdWx0IGluLW1lbW9yeSByZWdpc3RyeSBvZiBjb21wb25lbnQgY29uZmlndXJhdGlvbiBvYmplY3RzXG4gICAgLy8gICAgKGkuZS4sIHRoZSB0aGluZyB5b3UncmUgd3JpdGluZyB0byB3aGVuIHlvdSBjYWxsIGtvLmNvbXBvbmVudHMucmVnaXN0ZXIoc29tZU5hbWUsIC4uLikpXG4gICAgLy8gMi4gQW5zd2VyaW5nIHJlcXVlc3RzIGZvciBjb21wb25lbnRzIGJ5IGZldGNoaW5nIGNvbmZpZ3VyYXRpb24gb2JqZWN0c1xuICAgIC8vICAgIGZyb20gdGhhdCBkZWZhdWx0IGluLW1lbW9yeSByZWdpc3RyeSBhbmQgcmVzb2x2aW5nIHRoZW0gaW50byBzdGFuZGFyZFxuICAgIC8vICAgIGNvbXBvbmVudCBkZWZpbml0aW9uIG9iamVjdHMgKG9mIHRoZSBmb3JtIHsgY3JlYXRlVmlld01vZGVsOiAuLi4sIHRlbXBsYXRlOiAuLi4gfSlcbiAgICAvLyBDdXN0b20gbG9hZGVycyBtYXkgb3ZlcnJpZGUgZWl0aGVyIG9mIHRoZXNlIGZhY2lsaXRpZXMsIGkuZS4sXG4gICAgLy8gMS4gVG8gc3VwcGx5IGNvbmZpZ3VyYXRpb24gb2JqZWN0cyBmcm9tIHNvbWUgb3RoZXIgc291cmNlIChlLmcuLCBjb252ZW50aW9ucylcbiAgICAvLyAyLiBPciwgdG8gcmVzb2x2ZSBjb25maWd1cmF0aW9uIG9iamVjdHMgYnkgbG9hZGluZyB2aWV3bW9kZWxzL3RlbXBsYXRlcyB2aWEgYXJiaXRyYXJ5IGxvZ2ljLlxuXG4gICAgdmFyIGRlZmF1bHRDb25maWdSZWdpc3RyeSA9IHt9O1xuXG4gICAga28uY29tcG9uZW50cy5yZWdpc3RlciA9IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUsIGNvbmZpZykge1xuICAgICAgICBpZiAoIWNvbmZpZykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbmZpZ3VyYXRpb24gZm9yICcgKyBjb21wb25lbnROYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChrby5jb21wb25lbnRzLmlzUmVnaXN0ZXJlZChjb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb21wb25lbnQgJyArIGNvbXBvbmVudE5hbWUgKyAnIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVmYXVsdENvbmZpZ1JlZ2lzdHJ5W2NvbXBvbmVudE5hbWVdID0gY29uZmlnO1xuICAgIH07XG5cbiAgICBrby5jb21wb25lbnRzLmlzUmVnaXN0ZXJlZCA9IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRDb25maWdSZWdpc3RyeS5oYXNPd25Qcm9wZXJ0eShjb21wb25lbnROYW1lKTtcbiAgICB9O1xuXG4gICAga28uY29tcG9uZW50cy51bnJlZ2lzdGVyID0gZnVuY3Rpb24oY29tcG9uZW50TmFtZSkge1xuICAgICAgICBkZWxldGUgZGVmYXVsdENvbmZpZ1JlZ2lzdHJ5W2NvbXBvbmVudE5hbWVdO1xuICAgICAgICBrby5jb21wb25lbnRzLmNsZWFyQ2FjaGVkRGVmaW5pdGlvbihjb21wb25lbnROYW1lKTtcbiAgICB9O1xuXG4gICAga28uY29tcG9uZW50cy5kZWZhdWx0TG9hZGVyID0ge1xuICAgICAgICAnZ2V0Q29uZmlnJzogZnVuY3Rpb24oY29tcG9uZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBkZWZhdWx0Q29uZmlnUmVnaXN0cnkuaGFzT3duUHJvcGVydHkoY29tcG9uZW50TmFtZSlcbiAgICAgICAgICAgICAgICA/IGRlZmF1bHRDb25maWdSZWdpc3RyeVtjb21wb25lbnROYW1lXVxuICAgICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICAgIGNhbGxiYWNrKHJlc3VsdCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2xvYWRDb21wb25lbnQnOiBmdW5jdGlvbihjb21wb25lbnROYW1lLCBjb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3JDYWxsYmFjayA9IG1ha2VFcnJvckNhbGxiYWNrKGNvbXBvbmVudE5hbWUpO1xuICAgICAgICAgICAgcG9zc2libHlHZXRDb25maWdGcm9tQW1kKGVycm9yQ2FsbGJhY2ssIGNvbmZpZywgZnVuY3Rpb24obG9hZGVkQ29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZUNvbmZpZyhjb21wb25lbnROYW1lLCBlcnJvckNhbGxiYWNrLCBsb2FkZWRDb25maWcsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgICdsb2FkVGVtcGxhdGUnOiBmdW5jdGlvbihjb21wb25lbnROYW1lLCB0ZW1wbGF0ZUNvbmZpZywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJlc29sdmVUZW1wbGF0ZShtYWtlRXJyb3JDYWxsYmFjayhjb21wb25lbnROYW1lKSwgdGVtcGxhdGVDb25maWcsIGNhbGxiYWNrKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnbG9hZFZpZXdNb2RlbCc6IGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUsIHZpZXdNb2RlbENvbmZpZywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJlc29sdmVWaWV3TW9kZWwobWFrZUVycm9yQ2FsbGJhY2soY29tcG9uZW50TmFtZSksIHZpZXdNb2RlbENvbmZpZywgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBjcmVhdGVWaWV3TW9kZWxLZXkgPSAnY3JlYXRlVmlld01vZGVsJztcblxuICAgIC8vIFRha2VzIGEgY29uZmlnIG9iamVjdCBvZiB0aGUgZm9ybSB7IHRlbXBsYXRlOiAuLi4sIHZpZXdNb2RlbDogLi4uIH0sIGFuZCBhc3luY2hyb25vdXNseSBjb252ZXJ0IGl0XG4gICAgLy8gaW50byB0aGUgc3RhbmRhcmQgY29tcG9uZW50IGRlZmluaXRpb24gZm9ybWF0OlxuICAgIC8vICAgIHsgdGVtcGxhdGU6IDxBcnJheU9mRG9tTm9kZXM+LCBjcmVhdGVWaWV3TW9kZWw6IGZ1bmN0aW9uKHBhcmFtcywgY29tcG9uZW50SW5mbykgeyAuLi4gfSB9LlxuICAgIC8vIFNpbmNlIGJvdGggdGVtcGxhdGUgYW5kIHZpZXdNb2RlbCBtYXkgbmVlZCB0byBiZSByZXNvbHZlZCBhc3luY2hyb25vdXNseSwgYm90aCB0YXNrcyBhcmUgcGVyZm9ybWVkXG4gICAgLy8gaW4gcGFyYWxsZWwsIGFuZCB0aGUgcmVzdWx0cyBqb2luZWQgd2hlbiBib3RoIGFyZSByZWFkeS4gV2UgZG9uJ3QgZGVwZW5kIG9uIGFueSBwcm9taXNlcyBpbmZyYXN0cnVjdHVyZSxcbiAgICAvLyBzbyB0aGlzIGlzIGltcGxlbWVudGVkIG1hbnVhbGx5IGJlbG93LlxuICAgIGZ1bmN0aW9uIHJlc29sdmVDb25maWcoY29tcG9uZW50TmFtZSwgZXJyb3JDYWxsYmFjaywgY29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge30sXG4gICAgICAgICAgICBtYWtlQ2FsbEJhY2tXaGVuWmVybyA9IDIsXG4gICAgICAgICAgICB0cnlJc3N1ZUNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKC0tbWFrZUNhbGxCYWNrV2hlblplcm8gPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2socmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGVtcGxhdGVDb25maWcgPSBjb25maWdbJ3RlbXBsYXRlJ10sXG4gICAgICAgICAgICB2aWV3TW9kZWxDb25maWcgPSBjb25maWdbJ3ZpZXdNb2RlbCddO1xuXG4gICAgICAgIGlmICh0ZW1wbGF0ZUNvbmZpZykge1xuICAgICAgICAgICAgcG9zc2libHlHZXRDb25maWdGcm9tQW1kKGVycm9yQ2FsbGJhY2ssIHRlbXBsYXRlQ29uZmlnLCBmdW5jdGlvbihsb2FkZWRDb25maWcpIHtcbiAgICAgICAgICAgICAgICBrby5jb21wb25lbnRzLl9nZXRGaXJzdFJlc3VsdEZyb21Mb2FkZXJzKCdsb2FkVGVtcGxhdGUnLCBbY29tcG9uZW50TmFtZSwgbG9hZGVkQ29uZmlnXSwgZnVuY3Rpb24ocmVzb2x2ZWRUZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbJ3RlbXBsYXRlJ10gPSByZXNvbHZlZFRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICB0cnlJc3N1ZUNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeUlzc3VlQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2aWV3TW9kZWxDb25maWcpIHtcbiAgICAgICAgICAgIHBvc3NpYmx5R2V0Q29uZmlnRnJvbUFtZChlcnJvckNhbGxiYWNrLCB2aWV3TW9kZWxDb25maWcsIGZ1bmN0aW9uKGxvYWRlZENvbmZpZykge1xuICAgICAgICAgICAgICAgIGtvLmNvbXBvbmVudHMuX2dldEZpcnN0UmVzdWx0RnJvbUxvYWRlcnMoJ2xvYWRWaWV3TW9kZWwnLCBbY29tcG9uZW50TmFtZSwgbG9hZGVkQ29uZmlnXSwgZnVuY3Rpb24ocmVzb2x2ZWRWaWV3TW9kZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2NyZWF0ZVZpZXdNb2RlbEtleV0gPSByZXNvbHZlZFZpZXdNb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgdHJ5SXNzdWVDYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnlJc3N1ZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlVGVtcGxhdGUoZXJyb3JDYWxsYmFjaywgdGVtcGxhdGVDb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGVDb25maWcgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBNYXJrdXAgLSBwYXJzZSBpdFxuICAgICAgICAgICAgY2FsbGJhY2soa28udXRpbHMucGFyc2VIdG1sRnJhZ21lbnQodGVtcGxhdGVDb25maWcpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0ZW1wbGF0ZUNvbmZpZyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAvLyBBc3N1bWUgYWxyZWFkeSBhbiBhcnJheSBvZiBET00gbm9kZXMgLSBwYXNzIHRocm91Z2ggdW5jaGFuZ2VkXG4gICAgICAgICAgICBjYWxsYmFjayh0ZW1wbGF0ZUNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEb2N1bWVudEZyYWdtZW50KHRlbXBsYXRlQ29uZmlnKSkge1xuICAgICAgICAgICAgLy8gRG9jdW1lbnQgZnJhZ21lbnQgLSB1c2UgaXRzIGNoaWxkIG5vZGVzXG4gICAgICAgICAgICBjYWxsYmFjayhrby51dGlscy5tYWtlQXJyYXkodGVtcGxhdGVDb25maWcuY2hpbGROb2RlcykpO1xuICAgICAgICB9IGVsc2UgaWYgKHRlbXBsYXRlQ29uZmlnWydlbGVtZW50J10pIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGVtcGxhdGVDb25maWdbJ2VsZW1lbnQnXTtcbiAgICAgICAgICAgIGlmIChpc0RvbUVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAvLyBFbGVtZW50IGluc3RhbmNlIC0gY29weSBpdHMgY2hpbGQgbm9kZXNcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhjbG9uZU5vZGVzRnJvbVRlbXBsYXRlU291cmNlRWxlbWVudChlbGVtZW50KSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIC8vIEVsZW1lbnQgSUQgLSBmaW5kIGl0LCB0aGVuIGNvcHkgaXRzIGNoaWxkIG5vZGVzXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1JbnN0YW5jZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soY2xvbmVOb2Rlc0Zyb21UZW1wbGF0ZVNvdXJjZUVsZW1lbnQoZWxlbUluc3RhbmNlKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygnQ2Fubm90IGZpbmQgZWxlbWVudCB3aXRoIElEICcgKyBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soJ1Vua25vd24gZWxlbWVudCB0eXBlOiAnICsgZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvckNhbGxiYWNrKCdVbmtub3duIHRlbXBsYXRlIHZhbHVlOiAnICsgdGVtcGxhdGVDb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVZpZXdNb2RlbChlcnJvckNhbGxiYWNrLCB2aWV3TW9kZWxDb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygdmlld01vZGVsQ29uZmlnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvLyBDb25zdHJ1Y3RvciAtIGNvbnZlcnQgdG8gc3RhbmRhcmQgZmFjdG9yeSBmdW5jdGlvbiBmb3JtYXRcbiAgICAgICAgICAgIC8vIEJ5IGRlc2lnbiwgdGhpcyBkb2VzICpub3QqIHN1cHBseSBjb21wb25lbnRJbmZvIHRvIHRoZSBjb25zdHJ1Y3RvciwgYXMgdGhlIGludGVudCBpcyB0aGF0XG4gICAgICAgICAgICAvLyBjb21wb25lbnRJbmZvIGNvbnRhaW5zIG5vbi12aWV3bW9kZWwgZGF0YSAoZS5nLiwgdGhlIGNvbXBvbmVudCdzIGVsZW1lbnQpIHRoYXQgc2hvdWxkIG9ubHlcbiAgICAgICAgICAgIC8vIGJlIHVzZWQgaW4gZmFjdG9yeSBmdW5jdGlvbnMsIG5vdCB2aWV3bW9kZWwgY29uc3RydWN0b3JzLlxuICAgICAgICAgICAgY2FsbGJhY2soZnVuY3Rpb24gKHBhcmFtcyAvKiwgY29tcG9uZW50SW5mbyAqLykge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdmlld01vZGVsQ29uZmlnKHBhcmFtcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygdmlld01vZGVsQ29uZmlnW2NyZWF0ZVZpZXdNb2RlbEtleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIEFscmVhZHkgYSBmYWN0b3J5IGZ1bmN0aW9uIC0gdXNlIGl0IGFzLWlzXG4gICAgICAgICAgICBjYWxsYmFjayh2aWV3TW9kZWxDb25maWdbY3JlYXRlVmlld01vZGVsS2V5XSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2luc3RhbmNlJyBpbiB2aWV3TW9kZWxDb25maWcpIHtcbiAgICAgICAgICAgIC8vIEZpeGVkIG9iamVjdCBpbnN0YW5jZSAtIHByb21vdGUgdG8gY3JlYXRlVmlld01vZGVsIGZvcm1hdCBmb3IgQVBJIGNvbnNpc3RlbmN5XG4gICAgICAgICAgICB2YXIgZml4ZWRJbnN0YW5jZSA9IHZpZXdNb2RlbENvbmZpZ1snaW5zdGFuY2UnXTtcbiAgICAgICAgICAgIGNhbGxiYWNrKGZ1bmN0aW9uIChwYXJhbXMsIGNvbXBvbmVudEluZm8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZml4ZWRJbnN0YW5jZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKCd2aWV3TW9kZWwnIGluIHZpZXdNb2RlbENvbmZpZykge1xuICAgICAgICAgICAgLy8gUmVzb2x2ZWQgQU1EIG1vZHVsZSB3aG9zZSB2YWx1ZSBpcyBvZiB0aGUgZm9ybSB7IHZpZXdNb2RlbDogLi4uIH1cbiAgICAgICAgICAgIHJlc29sdmVWaWV3TW9kZWwoZXJyb3JDYWxsYmFjaywgdmlld01vZGVsQ29uZmlnWyd2aWV3TW9kZWwnXSwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3JDYWxsYmFjaygnVW5rbm93biB2aWV3TW9kZWwgdmFsdWU6ICcgKyB2aWV3TW9kZWxDb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvbmVOb2Rlc0Zyb21UZW1wbGF0ZVNvdXJjZUVsZW1lbnQoZWxlbUluc3RhbmNlKSB7XG4gICAgICAgIHN3aXRjaCAoa28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1JbnN0YW5jZSkpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NjcmlwdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLnBhcnNlSHRtbEZyYWdtZW50KGVsZW1JbnN0YW5jZS50ZXh0KTtcbiAgICAgICAgICAgIGNhc2UgJ3RleHRhcmVhJzpcbiAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMucGFyc2VIdG1sRnJhZ21lbnQoZWxlbUluc3RhbmNlLnZhbHVlKTtcbiAgICAgICAgICAgIGNhc2UgJ3RlbXBsYXRlJzpcbiAgICAgICAgICAgICAgICAvLyBGb3IgYnJvd3NlcnMgd2l0aCBwcm9wZXIgPHRlbXBsYXRlPiBlbGVtZW50IHN1cHBvcnQgKGkuZS4sIHdoZXJlIHRoZSAuY29udGVudCBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgIC8vIGdpdmVzIGEgZG9jdW1lbnQgZnJhZ21lbnQpLCB1c2UgdGhhdCBkb2N1bWVudCBmcmFnbWVudC5cbiAgICAgICAgICAgICAgICBpZiAoaXNEb2N1bWVudEZyYWdtZW50KGVsZW1JbnN0YW5jZS5jb250ZW50KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMuY2xvbmVOb2RlcyhlbGVtSW5zdGFuY2UuY29udGVudC5jaGlsZE5vZGVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWd1bGFyIGVsZW1lbnRzIHN1Y2ggYXMgPGRpdj4sIGFuZCA8dGVtcGxhdGU+IGVsZW1lbnRzIG9uIG9sZCBicm93c2VycyB0aGF0IGRvbid0IHJlYWxseVxuICAgICAgICAvLyB1bmRlcnN0YW5kIDx0ZW1wbGF0ZT4gYW5kIGp1c3QgdHJlYXQgaXQgYXMgYSByZWd1bGFyIGNvbnRhaW5lclxuICAgICAgICByZXR1cm4ga28udXRpbHMuY2xvbmVOb2RlcyhlbGVtSW5zdGFuY2UuY2hpbGROb2Rlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEb21FbGVtZW50KG9iaikge1xuICAgICAgICBpZiAod2luZG93WydIVE1MRWxlbWVudCddKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqICYmIG9iai50YWdOYW1lICYmIG9iai5ub2RlVHlwZSA9PT0gMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRG9jdW1lbnRGcmFnbWVudChvYmopIHtcbiAgICAgICAgaWYgKHdpbmRvd1snRG9jdW1lbnRGcmFnbWVudCddKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvc3NpYmx5R2V0Q29uZmlnRnJvbUFtZChlcnJvckNhbGxiYWNrLCBjb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnWydyZXF1aXJlJ10gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBUaGUgY29uZmlnIGlzIHRoZSB2YWx1ZSBvZiBhbiBBTUQgbW9kdWxlXG4gICAgICAgICAgICBpZiAoYW1kUmVxdWlyZSB8fCB3aW5kb3dbJ3JlcXVpcmUnXSkge1xuICAgICAgICAgICAgICAgIChhbWRSZXF1aXJlIHx8IHdpbmRvd1sncmVxdWlyZSddKShbY29uZmlnWydyZXF1aXJlJ11dLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2soJ1VzZXMgcmVxdWlyZSwgYnV0IG5vIEFNRCBsb2FkZXIgaXMgcHJlc2VudCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VFcnJvckNhbGxiYWNrKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudCBcXCcnICsgY29tcG9uZW50TmFtZSArICdcXCc6ICcgKyBtZXNzYWdlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMucmVnaXN0ZXInLCBrby5jb21wb25lbnRzLnJlZ2lzdGVyKTtcbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMuaXNSZWdpc3RlcmVkJywga28uY29tcG9uZW50cy5pc1JlZ2lzdGVyZWQpO1xuICAgIGtvLmV4cG9ydFN5bWJvbCgnY29tcG9uZW50cy51bnJlZ2lzdGVyJywga28uY29tcG9uZW50cy51bnJlZ2lzdGVyKTtcblxuICAgIC8vIEV4cG9zZSB0aGUgZGVmYXVsdCBsb2FkZXIgc28gdGhhdCBkZXZlbG9wZXJzIGNhbiBkaXJlY3RseSBhc2sgaXQgZm9yIGNvbmZpZ3VyYXRpb25cbiAgICAvLyBvciB0byByZXNvbHZlIGNvbmZpZ3VyYXRpb25cbiAgICBrby5leHBvcnRTeW1ib2woJ2NvbXBvbmVudHMuZGVmYXVsdExvYWRlcicsIGtvLmNvbXBvbmVudHMuZGVmYXVsdExvYWRlcik7XG5cbiAgICAvLyBCeSBkZWZhdWx0LCB0aGUgZGVmYXVsdCBsb2FkZXIgaXMgdGhlIG9ubHkgcmVnaXN0ZXJlZCBjb21wb25lbnQgbG9hZGVyXG4gICAga28uY29tcG9uZW50c1snbG9hZGVycyddLnB1c2goa28uY29tcG9uZW50cy5kZWZhdWx0TG9hZGVyKTtcblxuICAgIC8vIFByaXZhdGVseSBleHBvc2UgdGhlIHVuZGVybHlpbmcgY29uZmlnIHJlZ2lzdHJ5IGZvciB1c2UgaW4gb2xkLUlFIHNoaW1cbiAgICBrby5jb21wb25lbnRzLl9hbGxSZWdpc3RlcmVkQ29tcG9uZW50cyA9IGRlZmF1bHRDb25maWdSZWdpc3RyeTtcbn0pKCk7XG4oZnVuY3Rpb24gKHVuZGVmaW5lZCkge1xuICAgIC8vIE92ZXJyaWRhYmxlIEFQSSBmb3IgZGV0ZXJtaW5pbmcgd2hpY2ggY29tcG9uZW50IG5hbWUgYXBwbGllcyB0byBhIGdpdmVuIG5vZGUuIEJ5IG92ZXJyaWRpbmcgdGhpcyxcbiAgICAvLyB5b3UgY2FuIGZvciBleGFtcGxlIG1hcCBzcGVjaWZpYyB0YWdOYW1lcyB0byBjb21wb25lbnRzIHRoYXQgYXJlIG5vdCBwcmVyZWdpc3RlcmVkLlxuICAgIGtvLmNvbXBvbmVudHNbJ2dldENvbXBvbmVudE5hbWVGb3JOb2RlJ10gPSBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHZhciB0YWdOYW1lTG93ZXIgPSBrby51dGlscy50YWdOYW1lTG93ZXIobm9kZSk7XG4gICAgICAgIGlmIChrby5jb21wb25lbnRzLmlzUmVnaXN0ZXJlZCh0YWdOYW1lTG93ZXIpKSB7XG4gICAgICAgICAgICAvLyBUcnkgdG8gZGV0ZXJtaW5lIHRoYXQgdGhpcyBub2RlIGNhbiBiZSBjb25zaWRlcmVkIGEgKmN1c3RvbSogZWxlbWVudDsgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9pc3N1ZXMvMTYwM1xuICAgICAgICAgICAgaWYgKHRhZ05hbWVMb3dlci5pbmRleE9mKCctJykgIT0gLTEgfHwgKCcnICsgbm9kZSkgPT0gXCJbb2JqZWN0IEhUTUxVbmtub3duRWxlbWVudF1cIiB8fCAoa28udXRpbHMuaWVWZXJzaW9uIDw9IDggJiYgbm9kZS50YWdOYW1lID09PSB0YWdOYW1lTG93ZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhZ05hbWVMb3dlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBrby5jb21wb25lbnRzLmFkZEJpbmRpbmdzRm9yQ3VzdG9tRWxlbWVudCA9IGZ1bmN0aW9uKGFsbEJpbmRpbmdzLCBub2RlLCBiaW5kaW5nQ29udGV4dCwgdmFsdWVBY2Nlc3NvcnMpIHtcbiAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIGl0J3MgcmVhbGx5IGEgY3VzdG9tIGVsZW1lbnQgbWF0Y2hpbmcgYSBjb21wb25lbnRcbiAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIHZhciBjb21wb25lbnROYW1lID0ga28uY29tcG9uZW50c1snZ2V0Q29tcG9uZW50TmFtZUZvck5vZGUnXShub2RlKTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgLy8gSXQgZG9lcyByZXByZXNlbnQgYSBjb21wb25lbnQsIHNvIGFkZCBhIGNvbXBvbmVudCBiaW5kaW5nIGZvciBpdFxuICAgICAgICAgICAgICAgIGFsbEJpbmRpbmdzID0gYWxsQmluZGluZ3MgfHwge307XG5cbiAgICAgICAgICAgICAgICBpZiAoYWxsQmluZGluZ3NbJ2NvbXBvbmVudCddKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEF2b2lkIHNpbGVudGx5IG92ZXJ3cml0aW5nIHNvbWUgb3RoZXIgJ2NvbXBvbmVudCcgYmluZGluZyB0aGF0IG1heSBhbHJlYWR5IGJlIG9uIHRoZSBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSB0aGUgXCJjb21wb25lbnRcIiBiaW5kaW5nIG9uIGEgY3VzdG9tIGVsZW1lbnQgbWF0Y2hpbmcgYSBjb21wb25lbnQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50QmluZGluZ1ZhbHVlID0geyAnbmFtZSc6IGNvbXBvbmVudE5hbWUsICdwYXJhbXMnOiBnZXRDb21wb25lbnRQYXJhbXNGcm9tQ3VzdG9tRWxlbWVudChub2RlLCBiaW5kaW5nQ29udGV4dCkgfTtcblxuICAgICAgICAgICAgICAgIGFsbEJpbmRpbmdzWydjb21wb25lbnQnXSA9IHZhbHVlQWNjZXNzb3JzXG4gICAgICAgICAgICAgICAgICAgID8gZnVuY3Rpb24oKSB7IHJldHVybiBjb21wb25lbnRCaW5kaW5nVmFsdWU7IH1cbiAgICAgICAgICAgICAgICAgICAgOiBjb21wb25lbnRCaW5kaW5nVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWxsQmluZGluZ3M7XG4gICAgfVxuXG4gICAgdmFyIG5hdGl2ZUJpbmRpbmdQcm92aWRlckluc3RhbmNlID0gbmV3IGtvLmJpbmRpbmdQcm92aWRlcigpO1xuXG4gICAgZnVuY3Rpb24gZ2V0Q29tcG9uZW50UGFyYW1zRnJvbUN1c3RvbUVsZW1lbnQoZWxlbSwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgdmFyIHBhcmFtc0F0dHJpYnV0ZSA9IGVsZW0uZ2V0QXR0cmlidXRlKCdwYXJhbXMnKTtcblxuICAgICAgICBpZiAocGFyYW1zQXR0cmlidXRlKSB7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gbmF0aXZlQmluZGluZ1Byb3ZpZGVySW5zdGFuY2VbJ3BhcnNlQmluZGluZ3NTdHJpbmcnXShwYXJhbXNBdHRyaWJ1dGUsIGJpbmRpbmdDb250ZXh0LCBlbGVtLCB7ICd2YWx1ZUFjY2Vzc29ycyc6IHRydWUsICdiaW5kaW5nUGFyYW1zJzogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICByYXdQYXJhbUNvbXB1dGVkVmFsdWVzID0ga28udXRpbHMub2JqZWN0TWFwKHBhcmFtcywgZnVuY3Rpb24ocGFyYW1WYWx1ZSwgcGFyYW1OYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrby5jb21wdXRlZChwYXJhbVZhbHVlLCBudWxsLCB7IGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbSB9KTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBrby51dGlscy5vYmplY3RNYXAocmF3UGFyYW1Db21wdXRlZFZhbHVlcywgZnVuY3Rpb24ocGFyYW1WYWx1ZUNvbXB1dGVkLCBwYXJhbU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFtVmFsdWUgPSBwYXJhbVZhbHVlQ29tcHV0ZWQucGVlaygpO1xuICAgICAgICAgICAgICAgICAgICAvLyBEb2VzIHRoZSBldmFsdWF0aW9uIG9mIHRoZSBwYXJhbWV0ZXIgdmFsdWUgdW53cmFwIGFueSBvYnNlcnZhYmxlcz9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXJhbVZhbHVlQ29tcHV0ZWQuaXNBY3RpdmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm8gaXQgZG9lc24ndCwgc28gdGhlcmUncyBubyBuZWVkIGZvciBhbnkgY29tcHV0ZWQgd3JhcHBlci4gSnVzdCBwYXNzIHRocm91Z2ggdGhlIHN1cHBsaWVkIHZhbHVlIGRpcmVjdGx5LlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXhhbXBsZTogXCJzb21lVmFsOiBmaXJzdE5hbWUsIGFnZTogMTIzXCIgKHdoZXRoZXIgb3Igbm90IGZpcnN0TmFtZSBpcyBhbiBvYnNlcnZhYmxlL2NvbXB1dGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBZZXMgaXQgZG9lcy4gU3VwcGx5IGEgY29tcHV0ZWQgcHJvcGVydHkgdGhhdCB1bndyYXBzIGJvdGggdGhlIG91dGVyIChiaW5kaW5nIGV4cHJlc3Npb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsZXZlbCBvZiBvYnNlcnZhYmlsaXR5LCBhbmQgYW55IGlubmVyIChyZXN1bHRpbmcgbW9kZWwgdmFsdWUpIGxldmVsIG9mIG9ic2VydmFiaWxpdHkuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIG1lYW5zIHRoZSBjb21wb25lbnQgZG9lc24ndCBoYXZlIHRvIHdvcnJ5IGFib3V0IG11bHRpcGxlIHVud3JhcHBpbmcuIElmIHRoZSB2YWx1ZSBpcyBhXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3cml0YWJsZSBvYnNlcnZhYmxlLCB0aGUgY29tcHV0ZWQgd2lsbCBhbHNvIGJlIHdyaXRhYmxlIGFuZCBwYXNzIHRoZSB2YWx1ZSBvbiB0byB0aGUgb2JzZXJ2YWJsZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrby5jb21wdXRlZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3JlYWQnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUocGFyYW1WYWx1ZUNvbXB1dGVkKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3dyaXRlJzoga28uaXNXcml0ZWFibGVPYnNlcnZhYmxlKHBhcmFtVmFsdWUpICYmIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtVmFsdWVDb21wdXRlZCgpKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gR2l2ZSBhY2Nlc3MgdG8gdGhlIHJhdyBjb21wdXRlZHMsIGFzIGxvbmcgYXMgdGhhdCB3b3VsZG4ndCBvdmVyd3JpdGUgYW55IGN1c3RvbSBwYXJhbSBhbHNvIGNhbGxlZCAnJHJhdydcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgaW4gY2FzZSB0aGUgZGV2ZWxvcGVyIHdhbnRzIHRvIHJlYWN0IHRvIG91dGVyIChiaW5kaW5nKSBvYnNlcnZhYmlsaXR5IHNlcGFyYXRlbHkgZnJvbSBpbm5lclxuICAgICAgICAgICAgLy8gKG1vZGVsIHZhbHVlKSBvYnNlcnZhYmlsaXR5LCBvciBpbiBjYXNlIHRoZSBtb2RlbCB2YWx1ZSBvYnNlcnZhYmxlIGhhcyBzdWJvYnNlcnZhYmxlcy5cbiAgICAgICAgICAgIGlmICghcmVzdWx0Lmhhc093blByb3BlcnR5KCckcmF3JykpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbJyRyYXcnXSA9IHJhd1BhcmFtQ29tcHV0ZWRWYWx1ZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGb3IgY29uc2lzdGVuY3ksIGFic2VuY2Ugb2YgYSBcInBhcmFtc1wiIGF0dHJpYnV0ZSBpcyB0cmVhdGVkIHRoZSBzYW1lIGFzIHRoZSBwcmVzZW5jZSBvZlxuICAgICAgICAgICAgLy8gYW55IGVtcHR5IG9uZS4gT3RoZXJ3aXNlIGNvbXBvbmVudCB2aWV3bW9kZWxzIG5lZWQgc3BlY2lhbCBjb2RlIHRvIGNoZWNrIHdoZXRoZXIgb3Igbm90XG4gICAgICAgICAgICAvLyAncGFyYW1zJyBvciAncGFyYW1zLiRyYXcnIGlzIG51bGwvdW5kZWZpbmVkIGJlZm9yZSByZWFkaW5nIHN1YnByb3BlcnRpZXMsIHdoaWNoIGlzIGFubm95aW5nLlxuICAgICAgICAgICAgcmV0dXJuIHsgJyRyYXcnOiB7fSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDb21wYXRpYmlsaXR5IGNvZGUgZm9yIG9sZGVyIChwcmUtSFRNTDUpIElFIGJyb3dzZXJzXG5cbiAgICBpZiAoa28udXRpbHMuaWVWZXJzaW9uIDwgOSkge1xuICAgICAgICAvLyBXaGVuZXZlciB5b3UgcHJlcmVnaXN0ZXIgYSBjb21wb25lbnQsIGVuYWJsZSBpdCBhcyBhIGN1c3RvbSBlbGVtZW50IGluIHRoZSBjdXJyZW50IGRvY3VtZW50XG4gICAgICAgIGtvLmNvbXBvbmVudHNbJ3JlZ2lzdGVyJ10gPSAoZnVuY3Rpb24ob3JpZ2luYWxGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNvbXBvbmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGNvbXBvbmVudE5hbWUpOyAvLyBBbGxvd3MgSUU8OSB0byBwYXJzZSBtYXJrdXAgY29udGFpbmluZyB0aGUgY3VzdG9tIGVsZW1lbnRcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KShrby5jb21wb25lbnRzWydyZWdpc3RlciddKTtcblxuICAgICAgICAvLyBXaGVuZXZlciB5b3UgY3JlYXRlIGEgZG9jdW1lbnQgZnJhZ21lbnQsIGVuYWJsZSBhbGwgcHJlcmVnaXN0ZXJlZCBjb21wb25lbnQgbmFtZXMgYXMgY3VzdG9tIGVsZW1lbnRzXG4gICAgICAgIC8vIFRoaXMgaXMgbmVlZGVkIHRvIG1ha2UgaW5uZXJTaGl2L2pRdWVyeSBIVE1MIHBhcnNpbmcgY29ycmVjdGx5IGhhbmRsZSB0aGUgY3VzdG9tIGVsZW1lbnRzXG4gICAgICAgIGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQgPSAoZnVuY3Rpb24ob3JpZ2luYWxGdW5jdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdEb2NGcmFnID0gb3JpZ2luYWxGdW5jdGlvbigpLFxuICAgICAgICAgICAgICAgICAgICBhbGxDb21wb25lbnRzID0ga28uY29tcG9uZW50cy5fYWxsUmVnaXN0ZXJlZENvbXBvbmVudHM7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgY29tcG9uZW50TmFtZSBpbiBhbGxDb21wb25lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbGxDb21wb25lbnRzLmhhc093blByb3BlcnR5KGNvbXBvbmVudE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEb2NGcmFnLmNyZWF0ZUVsZW1lbnQoY29tcG9uZW50TmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ld0RvY0ZyYWc7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KShkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KTtcbiAgICB9XG59KSgpOyhmdW5jdGlvbih1bmRlZmluZWQpIHtcblxuICAgIHZhciBjb21wb25lbnRMb2FkaW5nT3BlcmF0aW9uVW5pcXVlSWQgPSAwO1xuXG4gICAga28uYmluZGluZ0hhbmRsZXJzWydjb21wb25lbnQnXSA9IHtcbiAgICAgICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBpZ25vcmVkMSwgaWdub3JlZDIsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudFZpZXdNb2RlbCxcbiAgICAgICAgICAgICAgICBjdXJyZW50TG9hZGluZ09wZXJhdGlvbklkLFxuICAgICAgICAgICAgICAgIGRpc3Bvc2VBc3NvY2lhdGVkQ29tcG9uZW50Vmlld01vZGVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFZpZXdNb2RlbERpc3Bvc2UgPSBjdXJyZW50Vmlld01vZGVsICYmIGN1cnJlbnRWaWV3TW9kZWxbJ2Rpc3Bvc2UnXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50Vmlld01vZGVsRGlzcG9zZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZpZXdNb2RlbERpc3Bvc2UuY2FsbChjdXJyZW50Vmlld01vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50Vmlld01vZGVsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgLy8gQW55IGluLWZsaWdodCBsb2FkaW5nIG9wZXJhdGlvbiBpcyBubyBsb25nZXIgcmVsZXZhbnQsIHNvIG1ha2Ugc3VyZSB3ZSBpZ25vcmUgaXRzIGNvbXBsZXRpb25cbiAgICAgICAgICAgICAgICAgICAgY3VycmVudExvYWRpbmdPcGVyYXRpb25JZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbENoaWxkTm9kZXMgPSBrby51dGlscy5tYWtlQXJyYXkoa28udmlydHVhbEVsZW1lbnRzLmNoaWxkTm9kZXMoZWxlbWVudCkpO1xuXG4gICAgICAgICAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsIGRpc3Bvc2VBc3NvY2lhdGVkQ29tcG9uZW50Vmlld01vZGVsKTtcblxuICAgICAgICAgICAga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKSxcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50TmFtZSwgY29tcG9uZW50UGFyYW1zO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50TmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudE5hbWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlWyduYW1lJ10pO1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRQYXJhbXMgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlWydwYXJhbXMnXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFjb21wb25lbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gY29tcG9uZW50IG5hbWUgc3BlY2lmaWVkJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGxvYWRpbmdPcGVyYXRpb25JZCA9IGN1cnJlbnRMb2FkaW5nT3BlcmF0aW9uSWQgPSArK2NvbXBvbmVudExvYWRpbmdPcGVyYXRpb25VbmlxdWVJZDtcbiAgICAgICAgICAgICAgICBrby5jb21wb25lbnRzLmdldChjb21wb25lbnROYW1lLCBmdW5jdGlvbihjb21wb25lbnREZWZpbml0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgbm90IHRoZSBjdXJyZW50IGxvYWQgb3BlcmF0aW9uIGZvciB0aGlzIGVsZW1lbnQsIGlnbm9yZSBpdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRMb2FkaW5nT3BlcmF0aW9uSWQgIT09IGxvYWRpbmdPcGVyYXRpb25JZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ2xlYW4gdXAgcHJldmlvdXMgc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgZGlzcG9zZUFzc29jaWF0ZWRDb21wb25lbnRWaWV3TW9kZWwoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbnN0YW50aWF0ZSBhbmQgYmluZCBuZXcgY29tcG9uZW50LiBJbXBsaWNpdGx5IHRoaXMgY2xlYW5zIGFueSBvbGQgRE9NIG5vZGVzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbXBvbmVudERlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBjb21wb25lbnQgXFwnJyArIGNvbXBvbmVudE5hbWUgKyAnXFwnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2xvbmVUZW1wbGF0ZUludG9FbGVtZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudERlZmluaXRpb24sIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcG9uZW50Vmlld01vZGVsID0gY3JlYXRlVmlld01vZGVsKGNvbXBvbmVudERlZmluaXRpb24sIGVsZW1lbnQsIG9yaWdpbmFsQ2hpbGROb2RlcywgY29tcG9uZW50UGFyYW1zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkQmluZGluZ0NvbnRleHQgPSBiaW5kaW5nQ29udGV4dFsnY3JlYXRlQ2hpbGRDb250ZXh0J10oY29tcG9uZW50Vmlld01vZGVsLCAvKiBkYXRhSXRlbUFsaWFzICovIHVuZGVmaW5lZCwgZnVuY3Rpb24oY3R4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4WyckY29tcG9uZW50J10gPSBjb21wb25lbnRWaWV3TW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4WyckY29tcG9uZW50VGVtcGxhdGVOb2RlcyddID0gb3JpZ2luYWxDaGlsZE5vZGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWaWV3TW9kZWwgPSBjb21wb25lbnRWaWV3TW9kZWw7XG4gICAgICAgICAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzKGNoaWxkQmluZGluZ0NvbnRleHQsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7ICdjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5ncyc6IHRydWUgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBrby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzWydjb21wb25lbnQnXSA9IHRydWU7XG5cbiAgICBmdW5jdGlvbiBjbG9uZVRlbXBsYXRlSW50b0VsZW1lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50RGVmaW5pdGlvbiwgZWxlbWVudCkge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBjb21wb25lbnREZWZpbml0aW9uWyd0ZW1wbGF0ZSddO1xuICAgICAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbXBvbmVudCBcXCcnICsgY29tcG9uZW50TmFtZSArICdcXCcgaGFzIG5vIHRlbXBsYXRlJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2xvbmVkTm9kZXNBcnJheSA9IGtvLnV0aWxzLmNsb25lTm9kZXModGVtcGxhdGUpO1xuICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuc2V0RG9tTm9kZUNoaWxkcmVuKGVsZW1lbnQsIGNsb25lZE5vZGVzQXJyYXkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVZpZXdNb2RlbChjb21wb25lbnREZWZpbml0aW9uLCBlbGVtZW50LCBvcmlnaW5hbENoaWxkTm9kZXMsIGNvbXBvbmVudFBhcmFtcykge1xuICAgICAgICB2YXIgY29tcG9uZW50Vmlld01vZGVsRmFjdG9yeSA9IGNvbXBvbmVudERlZmluaXRpb25bJ2NyZWF0ZVZpZXdNb2RlbCddO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50Vmlld01vZGVsRmFjdG9yeVxuICAgICAgICAgICAgPyBjb21wb25lbnRWaWV3TW9kZWxGYWN0b3J5LmNhbGwoY29tcG9uZW50RGVmaW5pdGlvbiwgY29tcG9uZW50UGFyYW1zLCB7ICdlbGVtZW50JzogZWxlbWVudCwgJ3RlbXBsYXRlTm9kZXMnOiBvcmlnaW5hbENoaWxkTm9kZXMgfSlcbiAgICAgICAgICAgIDogY29tcG9uZW50UGFyYW1zOyAvLyBUZW1wbGF0ZS1vbmx5IGNvbXBvbmVudFxuICAgIH1cblxufSkoKTtcbnZhciBhdHRySHRtbFRvSmF2YXNjcmlwdE1hcCA9IHsgJ2NsYXNzJzogJ2NsYXNzTmFtZScsICdmb3InOiAnaHRtbEZvcicgfTtcbmtvLmJpbmRpbmdIYW5kbGVyc1snYXR0ciddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSkgfHwge307XG4gICAgICAgIGtvLnV0aWxzLm9iamVjdEZvckVhY2godmFsdWUsIGZ1bmN0aW9uKGF0dHJOYW1lLCBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgIGF0dHJWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYXR0clZhbHVlKTtcblxuICAgICAgICAgICAgLy8gVG8gY292ZXIgY2FzZXMgbGlrZSBcImF0dHI6IHsgY2hlY2tlZDpzb21lUHJvcCB9XCIsIHdlIHdhbnQgdG8gcmVtb3ZlIHRoZSBhdHRyaWJ1dGUgZW50aXJlbHlcbiAgICAgICAgICAgIC8vIHdoZW4gc29tZVByb3AgaXMgYSBcIm5vIHZhbHVlXCItbGlrZSB2YWx1ZSAoc3RyaWN0bHkgbnVsbCwgZmFsc2UsIG9yIHVuZGVmaW5lZClcbiAgICAgICAgICAgIC8vIChiZWNhdXNlIHRoZSBhYnNlbmNlIG9mIHRoZSBcImNoZWNrZWRcIiBhdHRyIGlzIGhvdyB0byBtYXJrIGFuIGVsZW1lbnQgYXMgbm90IGNoZWNrZWQsIGV0Yy4pXG4gICAgICAgICAgICB2YXIgdG9SZW1vdmUgPSAoYXR0clZhbHVlID09PSBmYWxzZSkgfHwgKGF0dHJWYWx1ZSA9PT0gbnVsbCkgfHwgKGF0dHJWYWx1ZSA9PT0gdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIGlmICh0b1JlbW92ZSlcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgIC8vIEluIElFIDw9IDcgYW5kIElFOCBRdWlya3MgTW9kZSwgeW91IGhhdmUgdG8gdXNlIHRoZSBKYXZhc2NyaXB0IHByb3BlcnR5IG5hbWUgaW5zdGVhZCBvZiB0aGVcbiAgICAgICAgICAgIC8vIEhUTUwgYXR0cmlidXRlIG5hbWUgZm9yIGNlcnRhaW4gYXR0cmlidXRlcy4gSUU4IFN0YW5kYXJkcyBNb2RlIHN1cHBvcnRzIHRoZSBjb3JyZWN0IGJlaGF2aW9yLFxuICAgICAgICAgICAgLy8gYnV0IGluc3RlYWQgb2YgZmlndXJpbmcgb3V0IHRoZSBtb2RlLCB3ZSdsbCBqdXN0IHNldCB0aGUgYXR0cmlidXRlIHRocm91Z2ggdGhlIEphdmFzY3JpcHRcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IGZvciBJRSA8PSA4LlxuICAgICAgICAgICAgaWYgKGtvLnV0aWxzLmllVmVyc2lvbiA8PSA4ICYmIGF0dHJOYW1lIGluIGF0dHJIdG1sVG9KYXZhc2NyaXB0TWFwKSB7XG4gICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRySHRtbFRvSmF2YXNjcmlwdE1hcFthdHRyTmFtZV07XG4gICAgICAgICAgICAgICAgaWYgKHRvUmVtb3ZlKVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50W2F0dHJOYW1lXSA9IGF0dHJWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRvUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVHJlYXQgXCJuYW1lXCIgc3BlY2lhbGx5IC0gYWx0aG91Z2ggeW91IGNhbiB0aGluayBvZiBpdCBhcyBhbiBhdHRyaWJ1dGUsIGl0IGFsc28gbmVlZHNcbiAgICAgICAgICAgIC8vIHNwZWNpYWwgaGFuZGxpbmcgb24gb2xkZXIgdmVyc2lvbnMgb2YgSUUgKGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9wdWxsLzMzMylcbiAgICAgICAgICAgIC8vIERlbGliZXJhdGVseSBiZWluZyBjYXNlLXNlbnNpdGl2ZSBoZXJlIGJlY2F1c2UgWEhUTUwgd291bGQgcmVnYXJkIFwiTmFtZVwiIGFzIGEgZGlmZmVyZW50IHRoaW5nXG4gICAgICAgICAgICAvLyBlbnRpcmVseSwgYW5kIHRoZXJlJ3Mgbm8gc3Ryb25nIHJlYXNvbiB0byBhbGxvdyBmb3Igc3VjaCBjYXNpbmcgaW4gSFRNTC5cbiAgICAgICAgICAgIGlmIChhdHRyTmFtZSA9PT0gXCJuYW1lXCIpIHtcbiAgICAgICAgICAgICAgICBrby51dGlscy5zZXRFbGVtZW50TmFtZShlbGVtZW50LCB0b1JlbW92ZSA/IFwiXCIgOiBhdHRyVmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4oZnVuY3Rpb24oKSB7XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snY2hlY2tlZCddID0ge1xuICAgICdhZnRlcic6IFsndmFsdWUnLCAnYXR0ciddLFxuICAgICdpbml0JzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzKSB7XG4gICAgICAgIHZhciBjaGVja2VkVmFsdWUgPSBrby5wdXJlQ29tcHV0ZWQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBUcmVhdCBcInZhbHVlXCIgbGlrZSBcImNoZWNrZWRWYWx1ZVwiIHdoZW4gaXQgaXMgaW5jbHVkZWQgd2l0aCBcImNoZWNrZWRcIiBiaW5kaW5nXG4gICAgICAgICAgICBpZiAoYWxsQmluZGluZ3NbJ2hhcyddKCdjaGVja2VkVmFsdWUnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGFsbEJpbmRpbmdzLmdldCgnY2hlY2tlZFZhbHVlJykpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhbGxCaW5kaW5nc1snaGFzJ10oJ3ZhbHVlJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhbGxCaW5kaW5ncy5nZXQoJ3ZhbHVlJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTW9kZWwoKSB7XG4gICAgICAgICAgICAvLyBUaGlzIHVwZGF0ZXMgdGhlIG1vZGVsIHZhbHVlIGZyb20gdGhlIHZpZXcgdmFsdWUuXG4gICAgICAgICAgICAvLyBJdCBydW5zIGluIHJlc3BvbnNlIHRvIERPTSBldmVudHMgKGNsaWNrKSBhbmQgY2hhbmdlcyBpbiBjaGVja2VkVmFsdWUuXG4gICAgICAgICAgICB2YXIgaXNDaGVja2VkID0gZWxlbWVudC5jaGVja2VkLFxuICAgICAgICAgICAgICAgIGVsZW1WYWx1ZSA9IHVzZUNoZWNrZWRWYWx1ZSA/IGNoZWNrZWRWYWx1ZSgpIDogaXNDaGVja2VkO1xuXG4gICAgICAgICAgICAvLyBXaGVuIHdlJ3JlIGZpcnN0IHNldHRpbmcgdXAgdGhpcyBjb21wdXRlZCwgZG9uJ3QgY2hhbmdlIGFueSBtb2RlbCBzdGF0ZS5cbiAgICAgICAgICAgIGlmIChrby5jb21wdXRlZENvbnRleHQuaXNJbml0aWFsKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdlIGNhbiBpZ25vcmUgdW5jaGVja2VkIHJhZGlvIGJ1dHRvbnMsIGJlY2F1c2Ugc29tZSBvdGhlciByYWRpb1xuICAgICAgICAgICAgLy8gYnV0dG9uIHdpbGwgYmUgZ2V0dGluZyBjaGVja2VkLCBhbmQgdGhhdCBvbmUgY2FuIHRha2UgY2FyZSBvZiB1cGRhdGluZyBzdGF0ZS5cbiAgICAgICAgICAgIGlmIChpc1JhZGlvICYmICFpc0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0ga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUodmFsdWVBY2Nlc3Nvcik7XG4gICAgICAgICAgICBpZiAodmFsdWVJc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHdyaXRhYmxlVmFsdWUgPSByYXdWYWx1ZUlzTm9uQXJyYXlPYnNlcnZhYmxlID8gbW9kZWxWYWx1ZS5wZWVrKCkgOiBtb2RlbFZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChvbGRFbGVtVmFsdWUgIT09IGVsZW1WYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHdlJ3JlIHJlc3BvbmRpbmcgdG8gdGhlIGNoZWNrZWRWYWx1ZSBjaGFuZ2luZywgYW5kIHRoZSBlbGVtZW50IGlzXG4gICAgICAgICAgICAgICAgICAgIC8vIGN1cnJlbnRseSBjaGVja2VkLCByZXBsYWNlIHRoZSBvbGQgZWxlbSB2YWx1ZSB3aXRoIHRoZSBuZXcgZWxlbSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAvLyBpbiB0aGUgbW9kZWwgYXJyYXkuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0NoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFkZE9yUmVtb3ZlSXRlbSh3cml0YWJsZVZhbHVlLCBlbGVtVmFsdWUsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuYWRkT3JSZW1vdmVJdGVtKHdyaXRhYmxlVmFsdWUsIG9sZEVsZW1WYWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgb2xkRWxlbVZhbHVlID0gZWxlbVZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gd2UncmUgcmVzcG9uZGluZyB0byB0aGUgdXNlciBoYXZpbmcgY2hlY2tlZC91bmNoZWNrZWQgYSBjaGVja2JveCxcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkL3JlbW92ZSB0aGUgZWxlbWVudCB2YWx1ZSB0byB0aGUgbW9kZWwgYXJyYXkuXG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLmFkZE9yUmVtb3ZlSXRlbSh3cml0YWJsZVZhbHVlLCBlbGVtVmFsdWUsIGlzQ2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyYXdWYWx1ZUlzTm9uQXJyYXlPYnNlcnZhYmxlICYmIGtvLmlzV3JpdGVhYmxlT2JzZXJ2YWJsZShtb2RlbFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbFZhbHVlKHdyaXRhYmxlVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAga28uZXhwcmVzc2lvblJld3JpdGluZy53cml0ZVZhbHVlVG9Qcm9wZXJ0eShtb2RlbFZhbHVlLCBhbGxCaW5kaW5ncywgJ2NoZWNrZWQnLCBlbGVtVmFsdWUsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKSB7XG4gICAgICAgICAgICAvLyBUaGlzIHVwZGF0ZXMgdGhlIHZpZXcgdmFsdWUgZnJvbSB0aGUgbW9kZWwgdmFsdWUuXG4gICAgICAgICAgICAvLyBJdCBydW5zIGluIHJlc3BvbnNlIHRvIGNoYW5nZXMgaW4gdGhlIGJvdW5kIChjaGVja2VkKSB2YWx1ZS5cbiAgICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWVJc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgLy8gV2hlbiBhIGNoZWNrYm94IGlzIGJvdW5kIHRvIGFuIGFycmF5LCBiZWluZyBjaGVja2VkIHJlcHJlc2VudHMgaXRzIHZhbHVlIGJlaW5nIHByZXNlbnQgaW4gdGhhdCBhcnJheVxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hlY2tlZCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZihtb2RlbFZhbHVlLCBjaGVja2VkVmFsdWUoKSkgPj0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNDaGVja2JveCkge1xuICAgICAgICAgICAgICAgIC8vIFdoZW4gYSBjaGVja2JveCBpcyBib3VuZCB0byBhbnkgb3RoZXIgdmFsdWUgKG5vdCBhbiBhcnJheSksIGJlaW5nIGNoZWNrZWQgcmVwcmVzZW50cyB0aGUgdmFsdWUgYmVpbmcgdHJ1ZWlzaFxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hlY2tlZCA9IG1vZGVsVmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEZvciByYWRpbyBidXR0b25zLCBiZWluZyBjaGVja2VkIG1lYW5zIHRoYXQgdGhlIHJhZGlvIGJ1dHRvbidzIHZhbHVlIGNvcnJlc3BvbmRzIHRvIHRoZSBtb2RlbCB2YWx1ZVxuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2hlY2tlZCA9IChjaGVja2VkVmFsdWUoKSA9PT0gbW9kZWxWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGlzQ2hlY2tib3ggPSBlbGVtZW50LnR5cGUgPT0gXCJjaGVja2JveFwiLFxuICAgICAgICAgICAgaXNSYWRpbyA9IGVsZW1lbnQudHlwZSA9PSBcInJhZGlvXCI7XG5cbiAgICAgICAgLy8gT25seSBiaW5kIHRvIGNoZWNrIGJveGVzIGFuZCByYWRpbyBidXR0b25zXG4gICAgICAgIGlmICghaXNDaGVja2JveCAmJiAhaXNSYWRpbykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJhd1ZhbHVlID0gdmFsdWVBY2Nlc3NvcigpLFxuICAgICAgICAgICAgdmFsdWVJc0FycmF5ID0gaXNDaGVja2JveCAmJiAoa28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShyYXdWYWx1ZSkgaW5zdGFuY2VvZiBBcnJheSksXG4gICAgICAgICAgICByYXdWYWx1ZUlzTm9uQXJyYXlPYnNlcnZhYmxlID0gISh2YWx1ZUlzQXJyYXkgJiYgcmF3VmFsdWUucHVzaCAmJiByYXdWYWx1ZS5zcGxpY2UpLFxuICAgICAgICAgICAgb2xkRWxlbVZhbHVlID0gdmFsdWVJc0FycmF5ID8gY2hlY2tlZFZhbHVlKCkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB1c2VDaGVja2VkVmFsdWUgPSBpc1JhZGlvIHx8IHZhbHVlSXNBcnJheTtcblxuICAgICAgICAvLyBJRSA2IHdvbid0IGFsbG93IHJhZGlvIGJ1dHRvbnMgdG8gYmUgc2VsZWN0ZWQgdW5sZXNzIHRoZXkgaGF2ZSBhIG5hbWVcbiAgICAgICAgaWYgKGlzUmFkaW8gJiYgIWVsZW1lbnQubmFtZSlcbiAgICAgICAgICAgIGtvLmJpbmRpbmdIYW5kbGVyc1sndW5pcXVlTmFtZSddWydpbml0J10oZWxlbWVudCwgZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlIH0pO1xuXG4gICAgICAgIC8vIFNldCB1cCB0d28gY29tcHV0ZWRzIHRvIHVwZGF0ZSB0aGUgYmluZGluZzpcblxuICAgICAgICAvLyBUaGUgZmlyc3QgcmVzcG9uZHMgdG8gY2hhbmdlcyBpbiB0aGUgY2hlY2tlZFZhbHVlIHZhbHVlIGFuZCB0byBlbGVtZW50IGNsaWNrc1xuICAgICAgICBrby5jb21wdXRlZCh1cGRhdGVNb2RlbCwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQgfSk7XG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiY2xpY2tcIiwgdXBkYXRlTW9kZWwpO1xuXG4gICAgICAgIC8vIFRoZSBzZWNvbmQgcmVzcG9uZHMgdG8gY2hhbmdlcyBpbiB0aGUgbW9kZWwgdmFsdWUgKHRoZSBvbmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBjaGVja2VkIGJpbmRpbmcpXG4gICAgICAgIGtvLmNvbXB1dGVkKHVwZGF0ZVZpZXcsIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50IH0pO1xuXG4gICAgICAgIHJhd1ZhbHVlID0gdW5kZWZpbmVkO1xuICAgIH1cbn07XG5rby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzWydjaGVja2VkJ10gPSB0cnVlO1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2NoZWNrZWRWYWx1ZSddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICBlbGVtZW50LnZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgIH1cbn07XG5cbn0pKCk7dmFyIGNsYXNzZXNXcml0dGVuQnlCaW5kaW5nS2V5ID0gJ19fa29fX2Nzc1ZhbHVlJztcbmtvLmJpbmRpbmdIYW5kbGVyc1snY3NzJ10gPSB7XG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKHZhbHVlLCBmdW5jdGlvbihjbGFzc05hbWUsIHNob3VsZEhhdmVDbGFzcykge1xuICAgICAgICAgICAgICAgIHNob3VsZEhhdmVDbGFzcyA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoc2hvdWxkSGF2ZUNsYXNzKTtcbiAgICAgICAgICAgICAgICBrby51dGlscy50b2dnbGVEb21Ob2RlQ3NzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lLCBzaG91bGRIYXZlQ2xhc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGtvLnV0aWxzLnN0cmluZ1RyaW0oU3RyaW5nKHZhbHVlIHx8ICcnKSk7IC8vIE1ha2Ugc3VyZSB3ZSBkb24ndCB0cnkgdG8gc3RvcmUgb3Igc2V0IGEgbm9uLXN0cmluZyB2YWx1ZVxuICAgICAgICAgICAga28udXRpbHMudG9nZ2xlRG9tTm9kZUNzc0NsYXNzKGVsZW1lbnQsIGVsZW1lbnRbY2xhc3Nlc1dyaXR0ZW5CeUJpbmRpbmdLZXldLCBmYWxzZSk7XG4gICAgICAgICAgICBlbGVtZW50W2NsYXNzZXNXcml0dGVuQnlCaW5kaW5nS2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAga28udXRpbHMudG9nZ2xlRG9tTm9kZUNzc0NsYXNzKGVsZW1lbnQsIHZhbHVlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VuYWJsZSddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgICAgIGlmICh2YWx1ZSAmJiBlbGVtZW50LmRpc2FibGVkKVxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgZWxzZSBpZiAoKCF2YWx1ZSkgJiYgKCFlbGVtZW50LmRpc2FibGVkKSlcbiAgICAgICAgICAgIGVsZW1lbnQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbn07XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZGlzYWJsZSddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICBrby5iaW5kaW5nSGFuZGxlcnNbJ2VuYWJsZSddWyd1cGRhdGUnXShlbGVtZW50LCBmdW5jdGlvbigpIHsgcmV0dXJuICFrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSkgfSk7XG4gICAgfVxufTtcbi8vIEZvciBjZXJ0YWluIGNvbW1vbiBldmVudHMgKGN1cnJlbnRseSBqdXN0ICdjbGljaycpLCBhbGxvdyBhIHNpbXBsaWZpZWQgZGF0YS1iaW5kaW5nIHN5bnRheFxuLy8gZS5nLiBjbGljazpoYW5kbGVyIGluc3RlYWQgb2YgdGhlIHVzdWFsIGZ1bGwtbGVuZ3RoIGV2ZW50OntjbGljazpoYW5kbGVyfVxuZnVuY3Rpb24gbWFrZUV2ZW50SGFuZGxlclNob3J0Y3V0KGV2ZW50TmFtZSkge1xuICAgIGtvLmJpbmRpbmdIYW5kbGVyc1tldmVudE5hbWVdID0ge1xuICAgICAgICAnaW5pdCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICB2YXIgbmV3VmFsdWVBY2Nlc3NvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgICAgICAgICAgcmVzdWx0W2V2ZW50TmFtZV0gPSB2YWx1ZUFjY2Vzc29yKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzWydldmVudCddWydpbml0J10uY2FsbCh0aGlzLCBlbGVtZW50LCBuZXdWYWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmtvLmJpbmRpbmdIYW5kbGVyc1snZXZlbnQnXSA9IHtcbiAgICAnaW5pdCcgOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgdmFyIGV2ZW50c1RvSGFuZGxlID0gdmFsdWVBY2Nlc3NvcigpIHx8IHt9O1xuICAgICAgICBrby51dGlscy5vYmplY3RGb3JFYWNoKGV2ZW50c1RvSGFuZGxlLCBmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnROYW1lID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBldmVudE5hbWUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlclJldHVyblZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlckZ1bmN0aW9uID0gdmFsdWVBY2Nlc3NvcigpW2V2ZW50TmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghaGFuZGxlckZ1bmN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUYWtlIGFsbCB0aGUgZXZlbnQgYXJncywgYW5kIHByZWZpeCB3aXRoIHRoZSB2aWV3bW9kZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzRm9ySGFuZGxlciA9IGtvLnV0aWxzLm1ha2VBcnJheShhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld01vZGVsID0gYmluZGluZ0NvbnRleHRbJyRkYXRhJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzRm9ySGFuZGxlci51bnNoaWZ0KHZpZXdNb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyUmV0dXJuVmFsdWUgPSBoYW5kbGVyRnVuY3Rpb24uYXBwbHkodmlld01vZGVsLCBhcmdzRm9ySGFuZGxlcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFuZGxlclJldHVyblZhbHVlICE9PSB0cnVlKSB7IC8vIE5vcm1hbGx5IHdlIHdhbnQgdG8gcHJldmVudCBkZWZhdWx0IGFjdGlvbi4gRGV2ZWxvcGVyIGNhbiBvdmVycmlkZSB0aGlzIGJlIGV4cGxpY2l0bHkgcmV0dXJuaW5nIHRydWUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBidWJibGUgPSBhbGxCaW5kaW5ncy5nZXQoZXZlbnROYW1lICsgJ0J1YmJsZScpICE9PSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFidWJibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc3RvcFByb3BhZ2F0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4vLyBcImZvcmVhY2g6IHNvbWVFeHByZXNzaW9uXCIgaXMgZXF1aXZhbGVudCB0byBcInRlbXBsYXRlOiB7IGZvcmVhY2g6IHNvbWVFeHByZXNzaW9uIH1cIlxuLy8gXCJmb3JlYWNoOiB7IGRhdGE6IHNvbWVFeHByZXNzaW9uLCBhZnRlckFkZDogbXlmbiB9XCIgaXMgZXF1aXZhbGVudCB0byBcInRlbXBsYXRlOiB7IGZvcmVhY2g6IHNvbWVFeHByZXNzaW9uLCBhZnRlckFkZDogbXlmbiB9XCJcbmtvLmJpbmRpbmdIYW5kbGVyc1snZm9yZWFjaCddID0ge1xuICAgIG1ha2VUZW1wbGF0ZVZhbHVlQWNjZXNzb3I6IGZ1bmN0aW9uKHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG1vZGVsVmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCksXG4gICAgICAgICAgICAgICAgdW53cmFwcGVkVmFsdWUgPSBrby51dGlscy5wZWVrT2JzZXJ2YWJsZShtb2RlbFZhbHVlKTsgICAgLy8gVW53cmFwIHdpdGhvdXQgc2V0dGluZyBhIGRlcGVuZGVuY3kgaGVyZVxuXG4gICAgICAgICAgICAvLyBJZiB1bndyYXBwZWRWYWx1ZSBpcyB0aGUgYXJyYXksIHBhc3MgaW4gdGhlIHdyYXBwZWQgdmFsdWUgb24gaXRzIG93blxuICAgICAgICAgICAgLy8gVGhlIHZhbHVlIHdpbGwgYmUgdW53cmFwcGVkIGFuZCB0cmFja2VkIHdpdGhpbiB0aGUgdGVtcGxhdGUgYmluZGluZ1xuICAgICAgICAgICAgLy8gKFNlZSBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzUyMylcbiAgICAgICAgICAgIGlmICgoIXVud3JhcHBlZFZhbHVlKSB8fCB0eXBlb2YgdW53cmFwcGVkVmFsdWUubGVuZ3RoID09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgJ2ZvcmVhY2gnOiBtb2RlbFZhbHVlLCAndGVtcGxhdGVFbmdpbmUnOiBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZS5pbnN0YW5jZSB9O1xuXG4gICAgICAgICAgICAvLyBJZiB1bndyYXBwZWRWYWx1ZS5kYXRhIGlzIHRoZSBhcnJheSwgcHJlc2VydmUgYWxsIHJlbGV2YW50IG9wdGlvbnMgYW5kIHVud3JhcCBhZ2FpbiB2YWx1ZSBzbyB3ZSBnZXQgdXBkYXRlc1xuICAgICAgICAgICAga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShtb2RlbFZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ2ZvcmVhY2gnOiB1bndyYXBwZWRWYWx1ZVsnZGF0YSddLFxuICAgICAgICAgICAgICAgICdhcyc6IHVud3JhcHBlZFZhbHVlWydhcyddLFxuICAgICAgICAgICAgICAgICdpbmNsdWRlRGVzdHJveWVkJzogdW53cmFwcGVkVmFsdWVbJ2luY2x1ZGVEZXN0cm95ZWQnXSxcbiAgICAgICAgICAgICAgICAnYWZ0ZXJBZGQnOiB1bndyYXBwZWRWYWx1ZVsnYWZ0ZXJBZGQnXSxcbiAgICAgICAgICAgICAgICAnYmVmb3JlUmVtb3ZlJzogdW53cmFwcGVkVmFsdWVbJ2JlZm9yZVJlbW92ZSddLFxuICAgICAgICAgICAgICAgICdhZnRlclJlbmRlcic6IHVud3JhcHBlZFZhbHVlWydhZnRlclJlbmRlciddLFxuICAgICAgICAgICAgICAgICdiZWZvcmVNb3ZlJzogdW53cmFwcGVkVmFsdWVbJ2JlZm9yZU1vdmUnXSxcbiAgICAgICAgICAgICAgICAnYWZ0ZXJNb3ZlJzogdW53cmFwcGVkVmFsdWVbJ2FmdGVyTW92ZSddLFxuICAgICAgICAgICAgICAgICd0ZW1wbGF0ZUVuZ2luZSc6IGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lLmluc3RhbmNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgIH0sXG4gICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICByZXR1cm4ga28uYmluZGluZ0hhbmRsZXJzWyd0ZW1wbGF0ZSddWydpbml0J10oZWxlbWVudCwga28uYmluZGluZ0hhbmRsZXJzWydmb3JlYWNoJ10ubWFrZVRlbXBsYXRlVmFsdWVBY2Nlc3Nvcih2YWx1ZUFjY2Vzc29yKSk7XG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIGtvLmJpbmRpbmdIYW5kbGVyc1sndGVtcGxhdGUnXVsndXBkYXRlJ10oZWxlbWVudCwga28uYmluZGluZ0hhbmRsZXJzWydmb3JlYWNoJ10ubWFrZVRlbXBsYXRlVmFsdWVBY2Nlc3Nvcih2YWx1ZUFjY2Vzc29yKSwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpO1xuICAgIH1cbn07XG5rby5leHByZXNzaW9uUmV3cml0aW5nLmJpbmRpbmdSZXdyaXRlVmFsaWRhdG9yc1snZm9yZWFjaCddID0gZmFsc2U7IC8vIENhbid0IHJld3JpdGUgY29udHJvbCBmbG93IGJpbmRpbmdzXG5rby52aXJ0dWFsRWxlbWVudHMuYWxsb3dlZEJpbmRpbmdzWydmb3JlYWNoJ10gPSB0cnVlO1xudmFyIGhhc2ZvY3VzVXBkYXRpbmdQcm9wZXJ0eSA9ICdfX2tvX2hhc2ZvY3VzVXBkYXRpbmcnO1xudmFyIGhhc2ZvY3VzTGFzdFZhbHVlID0gJ19fa29faGFzZm9jdXNMYXN0VmFsdWUnO1xua28uYmluZGluZ0hhbmRsZXJzWydoYXNmb2N1cyddID0ge1xuICAgICdpbml0JzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MpIHtcbiAgICAgICAgdmFyIGhhbmRsZUVsZW1lbnRGb2N1c0NoYW5nZSA9IGZ1bmN0aW9uKGlzRm9jdXNlZCkge1xuICAgICAgICAgICAgLy8gV2hlcmUgcG9zc2libGUsIGlnbm9yZSB3aGljaCBldmVudCB3YXMgcmFpc2VkIGFuZCBkZXRlcm1pbmUgZm9jdXMgc3RhdGUgdXNpbmcgYWN0aXZlRWxlbWVudCxcbiAgICAgICAgICAgIC8vIGFzIHRoaXMgYXZvaWRzIHBoYW50b20gZm9jdXMvYmx1ciBldmVudHMgcmFpc2VkIHdoZW4gY2hhbmdpbmcgdGFicyBpbiBtb2Rlcm4gYnJvd3NlcnMuXG4gICAgICAgICAgICAvLyBIb3dldmVyLCBub3QgYWxsIEtPLXRhcmdldGVkIGJyb3dzZXJzIChGaXJlZm94IDIpIHN1cHBvcnQgYWN0aXZlRWxlbWVudC4gRm9yIHRob3NlIGJyb3dzZXJzLFxuICAgICAgICAgICAgLy8gcHJldmVudCBhIGxvc3Mgb2YgZm9jdXMgd2hlbiBjaGFuZ2luZyB0YWJzL3dpbmRvd3MgYnkgc2V0dGluZyBhIGZsYWcgdGhhdCBwcmV2ZW50cyBoYXNmb2N1c1xuICAgICAgICAgICAgLy8gZnJvbSBjYWxsaW5nICdibHVyKCknIG9uIHRoZSBlbGVtZW50IHdoZW4gaXQgbG9zZXMgZm9jdXMuXG4gICAgICAgICAgICAvLyBEaXNjdXNzaW9uIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9TdGV2ZVNhbmRlcnNvbi9rbm9ja291dC9wdWxsLzM1MlxuICAgICAgICAgICAgZWxlbWVudFtoYXNmb2N1c1VwZGF0aW5nUHJvcGVydHldID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvd25lckRvYyA9IGVsZW1lbnQub3duZXJEb2N1bWVudDtcbiAgICAgICAgICAgIGlmIChcImFjdGl2ZUVsZW1lbnRcIiBpbiBvd25lckRvYykge1xuICAgICAgICAgICAgICAgIHZhciBhY3RpdmU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlID0gb3duZXJEb2MuYWN0aXZlRWxlbWVudDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSUU5IHRocm93cyBpZiB5b3UgYWNjZXNzIGFjdGl2ZUVsZW1lbnQgZHVyaW5nIHBhZ2UgbG9hZCAoc2VlIGlzc3VlICM3MDMpXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IG93bmVyRG9jLmJvZHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlzRm9jdXNlZCA9IChhY3RpdmUgPT09IGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1vZGVsVmFsdWUgPSB2YWx1ZUFjY2Vzc29yKCk7XG4gICAgICAgICAgICBrby5leHByZXNzaW9uUmV3cml0aW5nLndyaXRlVmFsdWVUb1Byb3BlcnR5KG1vZGVsVmFsdWUsIGFsbEJpbmRpbmdzLCAnaGFzZm9jdXMnLCBpc0ZvY3VzZWQsIHRydWUpO1xuXG4gICAgICAgICAgICAvL2NhY2hlIHRoZSBsYXRlc3QgdmFsdWUsIHNvIHdlIGNhbiBhdm9pZCB1bm5lY2Vzc2FyaWx5IGNhbGxpbmcgZm9jdXMvYmx1ciBpbiB0aGUgdXBkYXRlIGZ1bmN0aW9uXG4gICAgICAgICAgICBlbGVtZW50W2hhc2ZvY3VzTGFzdFZhbHVlXSA9IGlzRm9jdXNlZDtcbiAgICAgICAgICAgIGVsZW1lbnRbaGFzZm9jdXNVcGRhdGluZ1Byb3BlcnR5XSA9IGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgaGFuZGxlRWxlbWVudEZvY3VzSW4gPSBoYW5kbGVFbGVtZW50Rm9jdXNDaGFuZ2UuYmluZChudWxsLCB0cnVlKTtcbiAgICAgICAgdmFyIGhhbmRsZUVsZW1lbnRGb2N1c091dCA9IGhhbmRsZUVsZW1lbnRGb2N1c0NoYW5nZS5iaW5kKG51bGwsIGZhbHNlKTtcblxuICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBcImZvY3VzXCIsIGhhbmRsZUVsZW1lbnRGb2N1c0luKTtcbiAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJmb2N1c2luXCIsIGhhbmRsZUVsZW1lbnRGb2N1c0luKTsgLy8gRm9yIElFXG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiYmx1clwiLCAgaGFuZGxlRWxlbWVudEZvY3VzT3V0KTtcbiAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJmb2N1c291dFwiLCAgaGFuZGxlRWxlbWVudEZvY3VzT3V0KTsgLy8gRm9yIElFXG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICB2YXIgdmFsdWUgPSAhIWtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcblxuICAgICAgICBpZiAoIWVsZW1lbnRbaGFzZm9jdXNVcGRhdGluZ1Byb3BlcnR5XSAmJiBlbGVtZW50W2hhc2ZvY3VzTGFzdFZhbHVlXSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHZhbHVlID8gZWxlbWVudC5mb2N1cygpIDogZWxlbWVudC5ibHVyKCk7XG5cbiAgICAgICAgICAgIC8vIEluIElFLCB0aGUgYmx1ciBtZXRob2QgZG9lc24ndCBhbHdheXMgY2F1c2UgdGhlIGVsZW1lbnQgdG8gbG9zZSBmb2N1cyAoZm9yIGV4YW1wbGUsIGlmIHRoZSB3aW5kb3cgaXMgbm90IGluIGZvY3VzKS5cbiAgICAgICAgICAgIC8vIFNldHRpbmcgZm9jdXMgdG8gdGhlIGJvZHkgZWxlbWVudCBkb2VzIHNlZW0gdG8gYmUgcmVsaWFibGUgaW4gSUUsIGJ1dCBzaG91bGQgb25seSBiZSB1c2VkIGlmIHdlIGtub3cgdGhhdCB0aGUgY3VycmVudFxuICAgICAgICAgICAgLy8gZWxlbWVudCB3YXMgZm9jdXNlZCBhbHJlYWR5LlxuICAgICAgICAgICAgaWYgKCF2YWx1ZSAmJiBlbGVtZW50W2hhc2ZvY3VzTGFzdFZhbHVlXSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQub3duZXJEb2N1bWVudC5ib2R5LmZvY3VzKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZvciBJRSwgd2hpY2ggZG9lc24ndCByZWxpYWJseSBmaXJlIFwiZm9jdXNcIiBvciBcImJsdXJcIiBldmVudHMgc3luY2hyb25vdXNseVxuICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoa28udXRpbHMudHJpZ2dlckV2ZW50LCBudWxsLCBbZWxlbWVudCwgdmFsdWUgPyBcImZvY3VzaW5cIiA6IFwiZm9jdXNvdXRcIl0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbmtvLmV4cHJlc3Npb25SZXdyaXRpbmcudHdvV2F5QmluZGluZ3NbJ2hhc2ZvY3VzJ10gPSB0cnVlO1xuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2hhc0ZvY3VzJ10gPSBrby5iaW5kaW5nSGFuZGxlcnNbJ2hhc2ZvY3VzJ107IC8vIE1ha2UgXCJoYXNGb2N1c1wiIGFuIGFsaWFzXG5rby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzWydoYXNGb2N1cyddID0gdHJ1ZTtcbmtvLmJpbmRpbmdIYW5kbGVyc1snaHRtbCddID0ge1xuICAgICdpbml0JzogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFByZXZlbnQgYmluZGluZyBvbiB0aGUgZHluYW1pY2FsbHktaW5qZWN0ZWQgSFRNTCAoYXMgZGV2ZWxvcGVycyBhcmUgdW5saWtlbHkgdG8gZXhwZWN0IHRoYXQsIGFuZCBpdCBoYXMgc2VjdXJpdHkgaW1wbGljYXRpb25zKVxuICAgICAgICByZXR1cm4geyAnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnOiB0cnVlIH07XG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgLy8gc2V0SHRtbCB3aWxsIHVud3JhcCB0aGUgdmFsdWUgaWYgbmVlZGVkXG4gICAgICAgIGtvLnV0aWxzLnNldEh0bWwoZWxlbWVudCwgdmFsdWVBY2Nlc3NvcigpKTtcbiAgICB9XG59O1xuLy8gTWFrZXMgYSBiaW5kaW5nIGxpa2Ugd2l0aCBvciBpZlxuZnVuY3Rpb24gbWFrZVdpdGhJZkJpbmRpbmcoYmluZGluZ0tleSwgaXNXaXRoLCBpc05vdCwgbWFrZUNvbnRleHRDYWxsYmFjaykge1xuICAgIGtvLmJpbmRpbmdIYW5kbGVyc1tiaW5kaW5nS2V5XSA9IHtcbiAgICAgICAgJ2luaXQnOiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuICAgICAgICAgICAgdmFyIGRpZERpc3BsYXlPbkxhc3RVcGRhdGUsXG4gICAgICAgICAgICAgICAgc2F2ZWROb2RlcztcbiAgICAgICAgICAgIGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciByYXdWYWx1ZSA9IHZhbHVlQWNjZXNzb3IoKSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShyYXdWYWx1ZSksXG4gICAgICAgICAgICAgICAgICAgIHNob3VsZERpc3BsYXkgPSAhaXNOb3QgIT09ICFkYXRhVmFsdWUsIC8vIGVxdWl2YWxlbnQgdG8gaXNOb3QgPyAhZGF0YVZhbHVlIDogISFkYXRhVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgaXNGaXJzdFJlbmRlciA9ICFzYXZlZE5vZGVzLFxuICAgICAgICAgICAgICAgICAgICBuZWVkc1JlZnJlc2ggPSBpc0ZpcnN0UmVuZGVyIHx8IGlzV2l0aCB8fCAoc2hvdWxkRGlzcGxheSAhPT0gZGlkRGlzcGxheU9uTGFzdFVwZGF0ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAobmVlZHNSZWZyZXNoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNhdmUgYSBjb3B5IG9mIHRoZSBpbm5lciBub2RlcyBvbiB0aGUgaW5pdGlhbCB1cGRhdGUsIGJ1dCBvbmx5IGlmIHdlIGhhdmUgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNGaXJzdFJlbmRlciAmJiBrby5jb21wdXRlZENvbnRleHQuZ2V0RGVwZW5kZW5jaWVzQ291bnQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZWROb2RlcyA9IGtvLnV0aWxzLmNsb25lTm9kZXMoa28udmlydHVhbEVsZW1lbnRzLmNoaWxkTm9kZXMoZWxlbWVudCksIHRydWUgLyogc2hvdWxkQ2xlYW5Ob2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2hvdWxkRGlzcGxheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0ZpcnN0UmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbihlbGVtZW50LCBrby51dGlscy5jbG9uZU5vZGVzKHNhdmVkTm9kZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzKG1ha2VDb250ZXh0Q2FsbGJhY2sgPyBtYWtlQ29udGV4dENhbGxiYWNrKGJpbmRpbmdDb250ZXh0LCByYXdWYWx1ZSkgOiBiaW5kaW5nQ29udGV4dCwgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby52aXJ0dWFsRWxlbWVudHMuZW1wdHlOb2RlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZGlkRGlzcGxheU9uTGFzdFVwZGF0ZSA9IHNob3VsZERpc3BsYXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQgfSk7XG4gICAgICAgICAgICByZXR1cm4geyAnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnOiB0cnVlIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzW2JpbmRpbmdLZXldID0gZmFsc2U7IC8vIENhbid0IHJld3JpdGUgY29udHJvbCBmbG93IGJpbmRpbmdzXG4gICAga28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1tiaW5kaW5nS2V5XSA9IHRydWU7XG59XG5cbi8vIENvbnN0cnVjdCB0aGUgYWN0dWFsIGJpbmRpbmcgaGFuZGxlcnNcbm1ha2VXaXRoSWZCaW5kaW5nKCdpZicpO1xubWFrZVdpdGhJZkJpbmRpbmcoJ2lmbm90JywgZmFsc2UgLyogaXNXaXRoICovLCB0cnVlIC8qIGlzTm90ICovKTtcbm1ha2VXaXRoSWZCaW5kaW5nKCd3aXRoJywgdHJ1ZSAvKiBpc1dpdGggKi8sIGZhbHNlIC8qIGlzTm90ICovLFxuICAgIGZ1bmN0aW9uKGJpbmRpbmdDb250ZXh0LCBkYXRhVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGJpbmRpbmdDb250ZXh0LmNyZWF0ZVN0YXRpY0NoaWxkQ29udGV4dChkYXRhVmFsdWUpO1xuICAgIH1cbik7XG52YXIgY2FwdGlvblBsYWNlaG9sZGVyID0ge307XG5rby5iaW5kaW5nSGFuZGxlcnNbJ29wdGlvbnMnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KSAhPT0gXCJzZWxlY3RcIilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm9wdGlvbnMgYmluZGluZyBhcHBsaWVzIG9ubHkgdG8gU0VMRUNUIGVsZW1lbnRzXCIpO1xuXG4gICAgICAgIC8vIFJlbW92ZSBhbGwgZXhpc3RpbmcgPG9wdGlvbj5zLlxuICAgICAgICB3aGlsZSAoZWxlbWVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuc3VyZXMgdGhhdCB0aGUgYmluZGluZyBwcm9jZXNzb3IgZG9lc24ndCB0cnkgdG8gYmluZCB0aGUgb3B0aW9uc1xuICAgICAgICByZXR1cm4geyAnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnOiB0cnVlIH07XG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzKSB7XG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdGVkT3B0aW9ucygpIHtcbiAgICAgICAgICAgIHJldHVybiBrby51dGlscy5hcnJheUZpbHRlcihlbGVtZW50Lm9wdGlvbnMsIGZ1bmN0aW9uIChub2RlKSB7IHJldHVybiBub2RlLnNlbGVjdGVkOyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxlY3RXYXNQcmV2aW91c2x5RW1wdHkgPSBlbGVtZW50Lmxlbmd0aCA9PSAwLFxuICAgICAgICAgICAgbXVsdGlwbGUgPSBlbGVtZW50Lm11bHRpcGxlLFxuICAgICAgICAgICAgcHJldmlvdXNTY3JvbGxUb3AgPSAoIXNlbGVjdFdhc1ByZXZpb3VzbHlFbXB0eSAmJiBtdWx0aXBsZSkgPyBlbGVtZW50LnNjcm9sbFRvcCA6IG51bGwsXG4gICAgICAgICAgICB1bndyYXBwZWRBcnJheSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKSxcbiAgICAgICAgICAgIHZhbHVlQWxsb3dVbnNldCA9IGFsbEJpbmRpbmdzLmdldCgndmFsdWVBbGxvd1Vuc2V0JykgJiYgYWxsQmluZGluZ3NbJ2hhcyddKCd2YWx1ZScpLFxuICAgICAgICAgICAgaW5jbHVkZURlc3Ryb3llZCA9IGFsbEJpbmRpbmdzLmdldCgnb3B0aW9uc0luY2x1ZGVEZXN0cm95ZWQnKSxcbiAgICAgICAgICAgIGFycmF5VG9Eb21Ob2RlQ2hpbGRyZW5PcHRpb25zID0ge30sXG4gICAgICAgICAgICBjYXB0aW9uVmFsdWUsXG4gICAgICAgICAgICBmaWx0ZXJlZEFycmF5LFxuICAgICAgICAgICAgcHJldmlvdXNTZWxlY3RlZFZhbHVlcyA9IFtdO1xuXG4gICAgICAgIGlmICghdmFsdWVBbGxvd1Vuc2V0KSB7XG4gICAgICAgICAgICBpZiAobXVsdGlwbGUpIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c1NlbGVjdGVkVmFsdWVzID0ga28udXRpbHMuYXJyYXlNYXAoc2VsZWN0ZWRPcHRpb25zKCksIGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5zZWxlY3RlZEluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c1NlbGVjdGVkVmFsdWVzLnB1c2goa28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudC5vcHRpb25zW2VsZW1lbnQuc2VsZWN0ZWRJbmRleF0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bndyYXBwZWRBcnJheSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1bndyYXBwZWRBcnJheS5sZW5ndGggPT0gXCJ1bmRlZmluZWRcIikgLy8gQ29lcmNlIHNpbmdsZSB2YWx1ZSBpbnRvIGFycmF5XG4gICAgICAgICAgICAgICAgdW53cmFwcGVkQXJyYXkgPSBbdW53cmFwcGVkQXJyYXldO1xuXG4gICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IGFueSBlbnRyaWVzIG1hcmtlZCBhcyBkZXN0cm95ZWRcbiAgICAgICAgICAgIGZpbHRlcmVkQXJyYXkgPSBrby51dGlscy5hcnJheUZpbHRlcih1bndyYXBwZWRBcnJheSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbmNsdWRlRGVzdHJveWVkIHx8IGl0ZW0gPT09IHVuZGVmaW5lZCB8fCBpdGVtID09PSBudWxsIHx8ICFrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGl0ZW1bJ19kZXN0cm95J10pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIElmIGNhcHRpb24gaXMgaW5jbHVkZWQsIGFkZCBpdCB0byB0aGUgYXJyYXlcbiAgICAgICAgICAgIGlmIChhbGxCaW5kaW5nc1snaGFzJ10oJ29wdGlvbnNDYXB0aW9uJykpIHtcbiAgICAgICAgICAgICAgICBjYXB0aW9uVmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGFsbEJpbmRpbmdzLmdldCgnb3B0aW9uc0NhcHRpb24nKSk7XG4gICAgICAgICAgICAgICAgLy8gSWYgY2FwdGlvbiB2YWx1ZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgZG9uJ3Qgc2hvdyBhIGNhcHRpb25cbiAgICAgICAgICAgICAgICBpZiAoY2FwdGlvblZhbHVlICE9PSBudWxsICYmIGNhcHRpb25WYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkQXJyYXkudW5zaGlmdChjYXB0aW9uUGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIGEgZmFsc3kgdmFsdWUgaXMgcHJvdmlkZWQgKGUuZy4gbnVsbCksIHdlJ2xsIHNpbXBseSBlbXB0eSB0aGUgc2VsZWN0IGVsZW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFwcGx5VG9PYmplY3Qob2JqZWN0LCBwcmVkaWNhdGUsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIHByZWRpY2F0ZVR5cGUgPSB0eXBlb2YgcHJlZGljYXRlO1xuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZVR5cGUgPT0gXCJmdW5jdGlvblwiKSAgICAvLyBHaXZlbiBhIGZ1bmN0aW9uOyBydW4gaXQgYWdhaW5zdCB0aGUgZGF0YSB2YWx1ZVxuICAgICAgICAgICAgICAgIHJldHVybiBwcmVkaWNhdGUob2JqZWN0KTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHByZWRpY2F0ZVR5cGUgPT0gXCJzdHJpbmdcIikgLy8gR2l2ZW4gYSBzdHJpbmc7IHRyZWF0IGl0IGFzIGEgcHJvcGVydHkgbmFtZSBvbiB0aGUgZGF0YSB2YWx1ZVxuICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3RbcHJlZGljYXRlXTtcbiAgICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdpdmVuIG5vIG9wdGlvbnNUZXh0IGFyZzsgdXNlIHRoZSBkYXRhIHZhbHVlIGl0c2VsZlxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBjYW4gcnVuIGF0IHR3byBkaWZmZXJlbnQgdGltZXM6XG4gICAgICAgIC8vIFRoZSBmaXJzdCBpcyB3aGVuIHRoZSB3aG9sZSBhcnJheSBpcyBiZWluZyB1cGRhdGVkIGRpcmVjdGx5IGZyb20gdGhpcyBiaW5kaW5nIGhhbmRsZXIuXG4gICAgICAgIC8vIFRoZSBzZWNvbmQgaXMgd2hlbiBhbiBvYnNlcnZhYmxlIHZhbHVlIGZvciBhIHNwZWNpZmljIGFycmF5IGVudHJ5IGlzIHVwZGF0ZWQuXG4gICAgICAgIC8vIG9sZE9wdGlvbnMgd2lsbCBiZSBlbXB0eSBpbiB0aGUgZmlyc3QgY2FzZSwgYnV0IHdpbGwgYmUgZmlsbGVkIHdpdGggdGhlIHByZXZpb3VzbHkgZ2VuZXJhdGVkIG9wdGlvbiBpbiB0aGUgc2Vjb25kLlxuICAgICAgICB2YXIgaXRlbVVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICBmdW5jdGlvbiBvcHRpb25Gb3JBcnJheUl0ZW0oYXJyYXlFbnRyeSwgaW5kZXgsIG9sZE9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvbGRPcHRpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMgPSAhdmFsdWVBbGxvd1Vuc2V0ICYmIG9sZE9wdGlvbnNbMF0uc2VsZWN0ZWQgPyBbIGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKG9sZE9wdGlvbnNbMF0pIF0gOiBbXTtcbiAgICAgICAgICAgICAgICBpdGVtVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBvcHRpb24gPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcbiAgICAgICAgICAgIGlmIChhcnJheUVudHJ5ID09PSBjYXB0aW9uUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICBrby51dGlscy5zZXRUZXh0Q29udGVudChvcHRpb24sIGFsbEJpbmRpbmdzLmdldCgnb3B0aW9uc0NhcHRpb24nKSk7XG4gICAgICAgICAgICAgICAga28uc2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlKG9wdGlvbiwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQXBwbHkgYSB2YWx1ZSB0byB0aGUgb3B0aW9uIGVsZW1lbnRcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9uVmFsdWUgPSBhcHBseVRvT2JqZWN0KGFycmF5RW50cnksIGFsbEJpbmRpbmdzLmdldCgnb3B0aW9uc1ZhbHVlJyksIGFycmF5RW50cnkpO1xuICAgICAgICAgICAgICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZShvcHRpb24sIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUob3B0aW9uVmFsdWUpKTtcblxuICAgICAgICAgICAgICAgIC8vIEFwcGx5IHNvbWUgdGV4dCB0byB0aGUgb3B0aW9uIGVsZW1lbnRcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9uVGV4dCA9IGFwcGx5VG9PYmplY3QoYXJyYXlFbnRyeSwgYWxsQmluZGluZ3MuZ2V0KCdvcHRpb25zVGV4dCcpLCBvcHRpb25WYWx1ZSk7XG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0VGV4dENvbnRlbnQob3B0aW9uLCBvcHRpb25UZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbb3B0aW9uXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJ5IHVzaW5nIGEgYmVmb3JlUmVtb3ZlIGNhbGxiYWNrLCB3ZSBkZWxheSB0aGUgcmVtb3ZhbCB1bnRpbCBhZnRlciBuZXcgaXRlbXMgYXJlIGFkZGVkLiBUaGlzIGZpeGVzIGEgc2VsZWN0aW9uXG4gICAgICAgIC8vIHByb2JsZW0gaW4gSUU8PTggYW5kIEZpcmVmb3guIFNlZSBodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQva25vY2tvdXQvaXNzdWVzLzEyMDhcbiAgICAgICAgYXJyYXlUb0RvbU5vZGVDaGlsZHJlbk9wdGlvbnNbJ2JlZm9yZVJlbW92ZSddID1cbiAgICAgICAgICAgIGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKG9wdGlvbik7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHNldFNlbGVjdGlvbkNhbGxiYWNrKGFycmF5RW50cnksIG5ld09wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChpdGVtVXBkYXRlICYmIHZhbHVlQWxsb3dVbnNldCkge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBtb2RlbCB2YWx1ZSBpcyBhdXRob3JpdGF0aXZlLCBzbyBtYWtlIHN1cmUgaXRzIHZhbHVlIGlzIHRoZSBvbmUgc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICAvLyBUaGVyZSBpcyBubyBuZWVkIHRvIHVzZSBkZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZSBzaW5jZSBzZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nIGRvZXMgc28gYWxyZWFkeS5cbiAgICAgICAgICAgICAgICBrby5zZWxlY3RFeHRlbnNpb25zLndyaXRlVmFsdWUoZWxlbWVudCwga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShhbGxCaW5kaW5ncy5nZXQoJ3ZhbHVlJykpLCB0cnVlIC8qIGFsbG93VW5zZXQgKi8pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcmV2aW91c1NlbGVjdGVkVmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIElFNiBkb2Vzbid0IGxpa2UgdXMgdG8gYXNzaWduIHNlbGVjdGlvbiB0byBPUFRJT04gbm9kZXMgYmVmb3JlIHRoZXkncmUgYWRkZWQgdG8gdGhlIGRvY3VtZW50LlxuICAgICAgICAgICAgICAgIC8vIFRoYXQncyB3aHkgd2UgZmlyc3QgYWRkZWQgdGhlbSB3aXRob3V0IHNlbGVjdGlvbi4gTm93IGl0J3MgdGltZSB0byBzZXQgdGhlIHNlbGVjdGlvbi5cbiAgICAgICAgICAgICAgICB2YXIgaXNTZWxlY3RlZCA9IGtvLnV0aWxzLmFycmF5SW5kZXhPZihwcmV2aW91c1NlbGVjdGVkVmFsdWVzLCBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShuZXdPcHRpb25zWzBdKSkgPj0gMDtcbiAgICAgICAgICAgICAgICBrby51dGlscy5zZXRPcHRpb25Ob2RlU2VsZWN0aW9uU3RhdGUobmV3T3B0aW9uc1swXSwgaXNTZWxlY3RlZCk7XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIG9wdGlvbiB3YXMgY2hhbmdlZCBmcm9tIGJlaW5nIHNlbGVjdGVkIGR1cmluZyBhIHNpbmdsZS1pdGVtIHVwZGF0ZSwgbm90aWZ5IHRoZSBjaGFuZ2VcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVVwZGF0ZSAmJiAhaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShrby51dGlscy50cmlnZ2VyRXZlbnQsIG51bGwsIFtlbGVtZW50LCBcImNoYW5nZVwiXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNhbGxiYWNrID0gc2V0U2VsZWN0aW9uQ2FsbGJhY2s7XG4gICAgICAgIGlmIChhbGxCaW5kaW5nc1snaGFzJ10oJ29wdGlvbnNBZnRlclJlbmRlcicpICYmIHR5cGVvZiBhbGxCaW5kaW5ncy5nZXQoJ29wdGlvbnNBZnRlclJlbmRlcicpID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbihhcnJheUVudHJ5LCBuZXdPcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgc2V0U2VsZWN0aW9uQ2FsbGJhY2soYXJyYXlFbnRyeSwgbmV3T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoYWxsQmluZGluZ3MuZ2V0KCdvcHRpb25zQWZ0ZXJSZW5kZXInKSwgbnVsbCwgW25ld09wdGlvbnNbMF0sIGFycmF5RW50cnkgIT09IGNhcHRpb25QbGFjZWhvbGRlciA/IGFycmF5RW50cnkgOiB1bmRlZmluZWRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGtvLnV0aWxzLnNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcoZWxlbWVudCwgZmlsdGVyZWRBcnJheSwgb3B0aW9uRm9yQXJyYXlJdGVtLCBhcnJheVRvRG9tTm9kZUNoaWxkcmVuT3B0aW9ucywgY2FsbGJhY2spO1xuXG4gICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZUFsbG93VW5zZXQpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgbW9kZWwgdmFsdWUgaXMgYXV0aG9yaXRhdGl2ZSwgc28gbWFrZSBzdXJlIGl0cyB2YWx1ZSBpcyB0aGUgb25lIHNlbGVjdGVkXG4gICAgICAgICAgICAgICAga28uc2VsZWN0RXh0ZW5zaW9ucy53cml0ZVZhbHVlKGVsZW1lbnQsIGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUoYWxsQmluZGluZ3MuZ2V0KCd2YWx1ZScpKSwgdHJ1ZSAvKiBhbGxvd1Vuc2V0ICovKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBzZWxlY3Rpb24gaGFzIGNoYW5nZWQgYXMgYSByZXN1bHQgb2YgdXBkYXRpbmcgdGhlIG9wdGlvbnMgbGlzdFxuICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rpb25DaGFuZ2VkO1xuICAgICAgICAgICAgICAgIGlmIChtdWx0aXBsZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBGb3IgYSBtdWx0aXBsZS1zZWxlY3QgYm94LCBjb21wYXJlIHRoZSBuZXcgc2VsZWN0aW9uIGNvdW50IHRvIHRoZSBwcmV2aW91cyBvbmVcbiAgICAgICAgICAgICAgICAgICAgLy8gQnV0IGlmIG5vdGhpbmcgd2FzIHNlbGVjdGVkIGJlZm9yZSwgdGhlIHNlbGVjdGlvbiBjYW4ndCBoYXZlIGNoYW5nZWRcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uQ2hhbmdlZCA9IHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMubGVuZ3RoICYmIHNlbGVjdGVkT3B0aW9ucygpLmxlbmd0aCA8IHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciBhIHNpbmdsZS1zZWxlY3QgYm94LCBjb21wYXJlIHRoZSBjdXJyZW50IHZhbHVlIHRvIHRoZSBwcmV2aW91cyB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAvLyBCdXQgaWYgbm90aGluZyB3YXMgc2VsZWN0ZWQgYmVmb3JlIG9yIG5vdGhpbmcgaXMgc2VsZWN0ZWQgbm93LCBqdXN0IGxvb2sgZm9yIGEgY2hhbmdlIGluIHNlbGVjdGlvblxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25DaGFuZ2VkID0gKHByZXZpb3VzU2VsZWN0ZWRWYWx1ZXMubGVuZ3RoICYmIGVsZW1lbnQuc2VsZWN0ZWRJbmRleCA+PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyAoa28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudC5vcHRpb25zW2VsZW1lbnQuc2VsZWN0ZWRJbmRleF0pICE9PSBwcmV2aW91c1NlbGVjdGVkVmFsdWVzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiAocHJldmlvdXNTZWxlY3RlZFZhbHVlcy5sZW5ndGggfHwgZWxlbWVudC5zZWxlY3RlZEluZGV4ID49IDApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEVuc3VyZSBjb25zaXN0ZW5jeSBiZXR3ZWVuIG1vZGVsIHZhbHVlIGFuZCBzZWxlY3RlZCBvcHRpb24uXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGRyb3Bkb3duIHdhcyBjaGFuZ2VkIHNvIHRoYXQgc2VsZWN0aW9uIGlzIG5vIGxvbmdlciB0aGUgc2FtZSxcbiAgICAgICAgICAgICAgICAvLyBub3RpZnkgdGhlIHZhbHVlIG9yIHNlbGVjdGVkT3B0aW9ucyBiaW5kaW5nLlxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb25DaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLnRyaWdnZXJFdmVudChlbGVtZW50LCBcImNoYW5nZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdvcmthcm91bmQgZm9yIElFIGJ1Z1xuICAgICAgICBrby51dGlscy5lbnN1cmVTZWxlY3RFbGVtZW50SXNSZW5kZXJlZENvcnJlY3RseShlbGVtZW50KTtcblxuICAgICAgICBpZiAocHJldmlvdXNTY3JvbGxUb3AgJiYgTWF0aC5hYnMocHJldmlvdXNTY3JvbGxUb3AgLSBlbGVtZW50LnNjcm9sbFRvcCkgPiAyMClcbiAgICAgICAgICAgIGVsZW1lbnQuc2Nyb2xsVG9wID0gcHJldmlvdXNTY3JvbGxUb3A7XG4gICAgfVxufTtcbmtvLmJpbmRpbmdIYW5kbGVyc1snb3B0aW9ucyddLm9wdGlvblZhbHVlRG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xua28uYmluZGluZ0hhbmRsZXJzWydzZWxlY3RlZE9wdGlvbnMnXSA9IHtcbiAgICAnYWZ0ZXInOiBbJ29wdGlvbnMnLCAnZm9yZWFjaCddLFxuICAgICdpbml0JzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzKSB7XG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlQWNjZXNzb3IoKSwgdmFsdWVUb1dyaXRlID0gW107XG4gICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm9wdGlvblwiKSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnNlbGVjdGVkKVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZVRvV3JpdGUucHVzaChrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShub2RlKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcud3JpdGVWYWx1ZVRvUHJvcGVydHkodmFsdWUsIGFsbEJpbmRpbmdzLCAnc2VsZWN0ZWRPcHRpb25zJywgdmFsdWVUb1dyaXRlKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgaWYgKGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KSAhPSBcInNlbGVjdFwiKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidmFsdWVzIGJpbmRpbmcgYXBwbGllcyBvbmx5IHRvIFNFTEVDVCBlbGVtZW50c1wiKTtcblxuICAgICAgICB2YXIgbmV3VmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSksXG4gICAgICAgICAgICBwcmV2aW91c1Njcm9sbFRvcCA9IGVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgICAgIGlmIChuZXdWYWx1ZSAmJiB0eXBlb2YgbmV3VmFsdWUubGVuZ3RoID09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwib3B0aW9uXCIpLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzU2VsZWN0ZWQgPSBrby51dGlscy5hcnJheUluZGV4T2YobmV3VmFsdWUsIGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKG5vZGUpKSA+PSAwO1xuICAgICAgICAgICAgICAgIGlmIChub2RlLnNlbGVjdGVkICE9IGlzU2VsZWN0ZWQpIHsgICAgICAvLyBUaGlzIGNoZWNrIHByZXZlbnRzIGZsYXNoaW5nIG9mIHRoZSBzZWxlY3QgZWxlbWVudCBpbiBJRVxuICAgICAgICAgICAgICAgICAgICBrby51dGlscy5zZXRPcHRpb25Ob2RlU2VsZWN0aW9uU3RhdGUobm9kZSwgaXNTZWxlY3RlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LnNjcm9sbFRvcCA9IHByZXZpb3VzU2Nyb2xsVG9wO1xuICAgIH1cbn07XG5rby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzWydzZWxlY3RlZE9wdGlvbnMnXSA9IHRydWU7XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3N0eWxlJ10gPSB7XG4gICAgJ3VwZGF0ZSc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpIHx8IHt9KTtcbiAgICAgICAga28udXRpbHMub2JqZWN0Rm9yRWFjaCh2YWx1ZSwgZnVuY3Rpb24oc3R5bGVOYW1lLCBzdHlsZVZhbHVlKSB7XG4gICAgICAgICAgICBzdHlsZVZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShzdHlsZVZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHN0eWxlVmFsdWUgPT09IG51bGwgfHwgc3R5bGVWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHN0eWxlVmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgLy8gRW1wdHkgc3RyaW5nIHJlbW92ZXMgdGhlIHZhbHVlLCB3aGVyZWFzIG51bGwvdW5kZWZpbmVkIGhhdmUgbm8gZWZmZWN0XG4gICAgICAgICAgICAgICAgc3R5bGVWYWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbc3R5bGVOYW1lXSA9IHN0eWxlVmFsdWU7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3N1Ym1pdCddID0ge1xuICAgICdpbml0JzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzLCB2aWV3TW9kZWwsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWVBY2Nlc3NvcigpICE9IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSB2YWx1ZSBmb3IgYSBzdWJtaXQgYmluZGluZyBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwic3VibWl0XCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZXJSZXR1cm5WYWx1ZTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlQWNjZXNzb3IoKTtcbiAgICAgICAgICAgIHRyeSB7IGhhbmRsZXJSZXR1cm5WYWx1ZSA9IHZhbHVlLmNhbGwoYmluZGluZ0NvbnRleHRbJyRkYXRhJ10sIGVsZW1lbnQpOyB9XG4gICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlclJldHVyblZhbHVlICE9PSB0cnVlKSB7IC8vIE5vcm1hbGx5IHdlIHdhbnQgdG8gcHJldmVudCBkZWZhdWx0IGFjdGlvbi4gRGV2ZWxvcGVyIGNhbiBvdmVycmlkZSB0aGlzIGJlIGV4cGxpY2l0bHkgcmV0dXJuaW5nIHRydWUuXG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdClcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xua28uYmluZGluZ0hhbmRsZXJzWyd0ZXh0J10gPSB7XG4gICAgJ2luaXQnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gUHJldmVudCBiaW5kaW5nIG9uIHRoZSBkeW5hbWljYWxseS1pbmplY3RlZCB0ZXh0IG5vZGUgKGFzIGRldmVsb3BlcnMgYXJlIHVubGlrZWx5IHRvIGV4cGVjdCB0aGF0LCBhbmQgaXQgaGFzIHNlY3VyaXR5IGltcGxpY2F0aW9ucykuXG4gICAgICAgIC8vIEl0IHNob3VsZCBhbHNvIG1ha2UgdGhpbmdzIGZhc3RlciwgYXMgd2Ugbm8gbG9uZ2VyIGhhdmUgdG8gY29uc2lkZXIgd2hldGhlciB0aGUgdGV4dCBub2RlIG1pZ2h0IGJlIGJpbmRhYmxlLlxuICAgICAgICByZXR1cm4geyAnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnOiB0cnVlIH07XG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAga28udXRpbHMuc2V0VGV4dENvbnRlbnQoZWxlbWVudCwgdmFsdWVBY2Nlc3NvcigpKTtcbiAgICB9XG59O1xua28udmlydHVhbEVsZW1lbnRzLmFsbG93ZWRCaW5kaW5nc1sndGV4dCddID0gdHJ1ZTtcbihmdW5jdGlvbiAoKSB7XG5cbmlmICh3aW5kb3cgJiYgd2luZG93Lm5hdmlnYXRvcikge1xuICAgIHZhciBwYXJzZVZlcnNpb24gPSBmdW5jdGlvbiAobWF0Y2hlcykge1xuICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobWF0Y2hlc1sxXSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gRGV0ZWN0IHZhcmlvdXMgYnJvd3NlciB2ZXJzaW9ucyBiZWNhdXNlIHNvbWUgb2xkIHZlcnNpb25zIGRvbid0IGZ1bGx5IHN1cHBvcnQgdGhlICdpbnB1dCcgZXZlbnRcbiAgICB2YXIgb3BlcmFWZXJzaW9uID0gd2luZG93Lm9wZXJhICYmIHdpbmRvdy5vcGVyYS52ZXJzaW9uICYmIHBhcnNlSW50KHdpbmRvdy5vcGVyYS52ZXJzaW9uKCkpLFxuICAgICAgICB1c2VyQWdlbnQgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCxcbiAgICAgICAgc2FmYXJpVmVyc2lvbiA9IHBhcnNlVmVyc2lvbih1c2VyQWdlbnQubWF0Y2goL14oPzooPyFjaHJvbWUpLikqdmVyc2lvblxcLyhbXiBdKikgc2FmYXJpL2kpKSxcbiAgICAgICAgZmlyZWZveFZlcnNpb24gPSBwYXJzZVZlcnNpb24odXNlckFnZW50Lm1hdGNoKC9GaXJlZm94XFwvKFteIF0qKS8pKTtcbn1cblxuLy8gSUUgOCBhbmQgOSBoYXZlIGJ1Z3MgdGhhdCBwcmV2ZW50IHRoZSBub3JtYWwgZXZlbnRzIGZyb20gZmlyaW5nIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMuXG4vLyBCdXQgaXQgZG9lcyBmaXJlIHRoZSAnc2VsZWN0aW9uY2hhbmdlJyBldmVudCBvbiBtYW55IG9mIHRob3NlLCBwcmVzdW1hYmx5IGJlY2F1c2UgdGhlXG4vLyBjdXJzb3IgaXMgbW92aW5nIGFuZCB0aGF0IGNvdW50cyBhcyB0aGUgc2VsZWN0aW9uIGNoYW5naW5nLiBUaGUgJ3NlbGVjdGlvbmNoYW5nZScgZXZlbnQgaXNcbi8vIGZpcmVkIGF0IHRoZSBkb2N1bWVudCBsZXZlbCBvbmx5IGFuZCBkb2Vzbid0IGRpcmVjdGx5IGluZGljYXRlIHdoaWNoIGVsZW1lbnQgY2hhbmdlZC4gV2Vcbi8vIHNldCB1cCBqdXN0IG9uZSBldmVudCBoYW5kbGVyIGZvciB0aGUgZG9jdW1lbnQgYW5kIHVzZSAnYWN0aXZlRWxlbWVudCcgdG8gZGV0ZXJtaW5lIHdoaWNoXG4vLyBlbGVtZW50IHdhcyBjaGFuZ2VkLlxuaWYgKGtvLnV0aWxzLmllVmVyc2lvbiA8IDEwKSB7XG4gICAgdmFyIHNlbGVjdGlvbkNoYW5nZVJlZ2lzdGVyZWROYW1lID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCksXG4gICAgICAgIHNlbGVjdGlvbkNoYW5nZUhhbmRsZXJOYW1lID0ga28udXRpbHMuZG9tRGF0YS5uZXh0S2V5KCk7XG4gICAgdmFyIHNlbGVjdGlvbkNoYW5nZUhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5hY3RpdmVFbGVtZW50LFxuICAgICAgICAgICAgaGFuZGxlciA9IHRhcmdldCAmJiBrby51dGlscy5kb21EYXRhLmdldCh0YXJnZXQsIHNlbGVjdGlvbkNoYW5nZUhhbmRsZXJOYW1lKTtcbiAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoZXZlbnQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgcmVnaXN0ZXJGb3JTZWxlY3Rpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBoYW5kbGVyKSB7XG4gICAgICAgIHZhciBvd25lckRvYyA9IGVsZW1lbnQub3duZXJEb2N1bWVudDtcbiAgICAgICAgaWYgKCFrby51dGlscy5kb21EYXRhLmdldChvd25lckRvYywgc2VsZWN0aW9uQ2hhbmdlUmVnaXN0ZXJlZE5hbWUpKSB7XG4gICAgICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChvd25lckRvYywgc2VsZWN0aW9uQ2hhbmdlUmVnaXN0ZXJlZE5hbWUsIHRydWUpO1xuICAgICAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIob3duZXJEb2MsICdzZWxlY3Rpb25jaGFuZ2UnLCBzZWxlY3Rpb25DaGFuZ2VIYW5kbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBrby51dGlscy5kb21EYXRhLnNldChlbGVtZW50LCBzZWxlY3Rpb25DaGFuZ2VIYW5kbGVyTmFtZSwgaGFuZGxlcik7XG4gICAgfTtcbn1cblxua28uYmluZGluZ0hhbmRsZXJzWyd0ZXh0SW5wdXQnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncykge1xuXG4gICAgICAgIHZhciBwcmV2aW91c0VsZW1lbnRWYWx1ZSA9IGVsZW1lbnQudmFsdWUsXG4gICAgICAgICAgICB0aW1lb3V0SGFuZGxlLFxuICAgICAgICAgICAgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQ7XG5cbiAgICAgICAgdmFyIHVwZGF0ZU1vZGVsID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEhhbmRsZSk7XG4gICAgICAgICAgICBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCA9IHRpbWVvdXRIYW5kbGUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50VmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgaWYgKHByZXZpb3VzRWxlbWVudFZhbHVlICE9PSBlbGVtZW50VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAvLyBQcm92aWRlIGEgd2F5IGZvciB0ZXN0cyB0byBrbm93IGV4YWN0bHkgd2hpY2ggZXZlbnQgd2FzIHByb2Nlc3NlZFxuICAgICAgICAgICAgICAgIGlmIChERUJVRyAmJiBldmVudCkgZWxlbWVudFsnX2tvX3RleHRJbnB1dFByb2Nlc3NlZEV2ZW50J10gPSBldmVudC50eXBlO1xuICAgICAgICAgICAgICAgIHByZXZpb3VzRWxlbWVudFZhbHVlID0gZWxlbWVudFZhbHVlO1xuICAgICAgICAgICAgICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcud3JpdGVWYWx1ZVRvUHJvcGVydHkodmFsdWVBY2Nlc3NvcigpLCBhbGxCaW5kaW5ncywgJ3RleHRJbnB1dCcsIGVsZW1lbnRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGRlZmVyVXBkYXRlTW9kZWwgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICghdGltZW91dEhhbmRsZSkge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCB2YXJpYWJsZSBpcyBzZXQgKm9ubHkqIGR1cmluZyB0aGUgYnJpZWYgZ2FwIGJldHdlZW4gYW5cbiAgICAgICAgICAgICAgICAvLyBldmVudCBmaXJpbmcgYW5kIHRoZSB1cGRhdGVNb2RlbCBmdW5jdGlvbiBydW5uaW5nLiBUaGlzIGFsbG93cyB1cyB0byBpZ25vcmUgbW9kZWxcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoYXQgYXJlIGZyb20gdGhlIHByZXZpb3VzIHN0YXRlIG9mIHRoZSBlbGVtZW50LCB1c3VhbGx5IGR1ZSB0byB0ZWNobmlxdWVzXG4gICAgICAgICAgICAgICAgLy8gc3VjaCBhcyByYXRlTGltaXQuIFN1Y2ggdXBkYXRlcywgaWYgbm90IGlnbm9yZWQsIGNhbiBjYXVzZSBrZXlzdHJva2VzIHRvIGJlIGxvc3QuXG4gICAgICAgICAgICAgICAgZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyID0gREVCVUcgPyB1cGRhdGVNb2RlbC5iaW5kKGVsZW1lbnQsIHt0eXBlOiBldmVudC50eXBlfSkgOiB1cGRhdGVNb2RlbDtcbiAgICAgICAgICAgICAgICB0aW1lb3V0SGFuZGxlID0ga28udXRpbHMuc2V0VGltZW91dChoYW5kbGVyLCA0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJRTkgd2lsbCBtZXNzIHVwIHRoZSBET00gaWYgeW91IGhhbmRsZSBldmVudHMgc3luY2hyb25vdXNseSB3aGljaCByZXN1bHRzIGluIERPTSBjaGFuZ2VzIChzdWNoIGFzIG90aGVyIGJpbmRpbmdzKTtcbiAgICAgICAgLy8gc28gd2UnbGwgbWFrZSBzdXJlIGFsbCB1cGRhdGVzIGFyZSBhc3luY2hyb25vdXNcbiAgICAgICAgdmFyIGllVXBkYXRlTW9kZWwgPSBrby51dGlscy5pZVZlcnNpb24gPT0gOSA/IGRlZmVyVXBkYXRlTW9kZWwgOiB1cGRhdGVNb2RlbDtcblxuICAgICAgICB2YXIgdXBkYXRlVmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtb2RlbFZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuXG4gICAgICAgICAgICBpZiAobW9kZWxWYWx1ZSA9PT0gbnVsbCB8fCBtb2RlbFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBtb2RlbFZhbHVlID0gJyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50VmFsdWVCZWZvcmVFdmVudCAhPT0gdW5kZWZpbmVkICYmIG1vZGVsVmFsdWUgPT09IGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0VGltZW91dCh1cGRhdGVWaWV3LCA0KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgZWxlbWVudCBvbmx5IGlmIHRoZSBlbGVtZW50IGFuZCBtb2RlbCBhcmUgZGlmZmVyZW50LiBPbiBzb21lIGJyb3dzZXJzLCB1cGRhdGluZyB0aGUgdmFsdWVcbiAgICAgICAgICAgIC8vIHdpbGwgbW92ZSB0aGUgY3Vyc29yIHRvIHRoZSBlbmQgb2YgdGhlIGlucHV0LCB3aGljaCB3b3VsZCBiZSBiYWQgd2hpbGUgdGhlIHVzZXIgaXMgdHlwaW5nLlxuICAgICAgICAgICAgaWYgKGVsZW1lbnQudmFsdWUgIT09IG1vZGVsVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c0VsZW1lbnRWYWx1ZSA9IG1vZGVsVmFsdWU7ICAvLyBNYWtlIHN1cmUgd2UgaWdub3JlIGV2ZW50cyAocHJvcGVydHljaGFuZ2UpIHRoYXQgcmVzdWx0IGZyb20gdXBkYXRpbmcgdGhlIHZhbHVlXG4gICAgICAgICAgICAgICAgZWxlbWVudC52YWx1ZSA9IG1vZGVsVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIG9uRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIGV2ZW50LCBoYW5kbGVyKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoREVCVUcgJiYga28uYmluZGluZ0hhbmRsZXJzWyd0ZXh0SW5wdXQnXVsnX2ZvcmNlVXBkYXRlT24nXSkge1xuICAgICAgICAgICAgLy8gUHJvdmlkZSBhIHdheSBmb3IgdGVzdHMgdG8gc3BlY2lmeSBleGFjdGx5IHdoaWNoIGV2ZW50cyBhcmUgYm91bmRcbiAgICAgICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChrby5iaW5kaW5nSGFuZGxlcnNbJ3RleHRJbnB1dCddWydfZm9yY2VVcGRhdGVPbiddLCBmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnROYW1lLnNsaWNlKDAsNSkgPT0gJ2FmdGVyJykge1xuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KGV2ZW50TmFtZS5zbGljZSg1KSwgZGVmZXJVcGRhdGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb25FdmVudChldmVudE5hbWUsIHVwZGF0ZU1vZGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChrby51dGlscy5pZVZlcnNpb24gPCAxMCkge1xuICAgICAgICAgICAgICAgIC8vIEludGVybmV0IEV4cGxvcmVyIDw9IDggZG9lc24ndCBzdXBwb3J0IHRoZSAnaW5wdXQnIGV2ZW50LCBidXQgZG9lcyBpbmNsdWRlICdwcm9wZXJ0eWNoYW5nZScgdGhhdCBmaXJlcyB3aGVuZXZlclxuICAgICAgICAgICAgICAgIC8vIGFueSBwcm9wZXJ0eSBvZiBhbiBlbGVtZW50IGNoYW5nZXMuIFVubGlrZSAnaW5wdXQnLCBpdCBhbHNvIGZpcmVzIGlmIGEgcHJvcGVydHkgaXMgY2hhbmdlZCBmcm9tIEphdmFTY3JpcHQgY29kZSxcbiAgICAgICAgICAgICAgICAvLyBidXQgdGhhdCdzIGFuIGFjY2VwdGFibGUgY29tcHJvbWlzZSBmb3IgdGhpcyBiaW5kaW5nLiBJRSA5IGRvZXMgc3VwcG9ydCAnaW5wdXQnLCBidXQgc2luY2UgaXQgZG9lc24ndCBmaXJlIGl0XG4gICAgICAgICAgICAgICAgLy8gd2hlbiB1c2luZyBhdXRvY29tcGxldGUsIHdlJ2xsIHVzZSAncHJvcGVydHljaGFuZ2UnIGZvciBpdCBhbHNvLlxuICAgICAgICAgICAgICAgIG9uRXZlbnQoJ3Byb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnByb3BlcnR5TmFtZSA9PT0gJ3ZhbHVlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWVVcGRhdGVNb2RlbChldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChrby51dGlscy5pZVZlcnNpb24gPT0gOCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJRSA4IGhhcyBhIGJ1ZyB3aGVyZSBpdCBmYWlscyB0byBmaXJlICdwcm9wZXJ0eWNoYW5nZScgb24gdGhlIGZpcnN0IHVwZGF0ZSBmb2xsb3dpbmcgYSB2YWx1ZSBjaGFuZ2UgZnJvbVxuICAgICAgICAgICAgICAgICAgICAvLyBKYXZhU2NyaXB0IGNvZGUuIEl0IGFsc28gZG9lc24ndCBmaXJlIGlmIHlvdSBjbGVhciB0aGUgZW50aXJlIHZhbHVlLiBUbyBmaXggdGhpcywgd2UgYmluZCB0byB0aGUgZm9sbG93aW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIGV2ZW50cyB0b28uXG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2tleXVwJywgdXBkYXRlTW9kZWwpOyAgICAgIC8vIEEgc2luZ2xlIGtleXN0b2tlXG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2tleWRvd24nLCB1cGRhdGVNb2RlbCk7ICAgIC8vIFRoZSBmaXJzdCBjaGFyYWN0ZXIgd2hlbiBhIGtleSBpcyBoZWxkIGRvd25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGtvLnV0aWxzLmllVmVyc2lvbiA+PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEludGVybmV0IEV4cGxvcmVyIDkgZG9lc24ndCBmaXJlIHRoZSAnaW5wdXQnIGV2ZW50IHdoZW4gZGVsZXRpbmcgdGV4dCwgaW5jbHVkaW5nIHVzaW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBiYWNrc3BhY2UsIGRlbGV0ZSwgb3IgY3RybC14IGtleXMsIGNsaWNraW5nIHRoZSAneCcgdG8gY2xlYXIgdGhlIGlucHV0LCBkcmFnZ2luZyB0ZXh0XG4gICAgICAgICAgICAgICAgICAgIC8vIG91dCBvZiB0aGUgZmllbGQsIGFuZCBjdXR0aW5nIG9yIGRlbGV0aW5nIHRleHQgdXNpbmcgdGhlIGNvbnRleHQgbWVudS4gJ3NlbGVjdGlvbmNoYW5nZSdcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FuIGRldGVjdCBhbGwgb2YgdGhvc2UgZXhjZXB0IGRyYWdnaW5nIHRleHQgb3V0IG9mIHRoZSBmaWVsZCwgZm9yIHdoaWNoIHdlIHVzZSAnZHJhZ2VuZCcuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZXNlIGFyZSBhbHNvIG5lZWRlZCBpbiBJRTggYmVjYXVzZSBvZiB0aGUgYnVnIGRlc2NyaWJlZCBhYm92ZS5cbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0ZXJGb3JTZWxlY3Rpb25DaGFuZ2VFdmVudChlbGVtZW50LCBpZVVwZGF0ZU1vZGVsKTsgIC8vICdzZWxlY3Rpb25jaGFuZ2UnIGNvdmVycyBjdXQsIHBhc3RlLCBkcm9wLCBkZWxldGUsIGV0Yy5cbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgnZHJhZ2VuZCcsIGRlZmVyVXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQWxsIG90aGVyIHN1cHBvcnRlZCBicm93c2VycyBzdXBwb3J0IHRoZSAnaW5wdXQnIGV2ZW50LCB3aGljaCBmaXJlcyB3aGVuZXZlciB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCBpcyBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgLy8gdGhyb3VnaCB0aGUgdXNlciBpbnRlcmZhY2UuXG4gICAgICAgICAgICAgICAgb25FdmVudCgnaW5wdXQnLCB1cGRhdGVNb2RlbCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2FmYXJpVmVyc2lvbiA8IDUgJiYga28udXRpbHMudGFnTmFtZUxvd2VyKGVsZW1lbnQpID09PSBcInRleHRhcmVhXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIDw1IGRvZXNuJ3QgZmlyZSB0aGUgJ2lucHV0JyBldmVudCBmb3IgPHRleHRhcmVhPiBlbGVtZW50cyAoaXQgZG9lcyBmaXJlICd0ZXh0SW5wdXQnXG4gICAgICAgICAgICAgICAgICAgIC8vIGJ1dCBvbmx5IHdoZW4gdHlwaW5nKS4gU28gd2UnbGwganVzdCBjYXRjaCBhcyBtdWNoIGFzIHdlIGNhbiB3aXRoIGtleWRvd24sIGN1dCwgYW5kIHBhc3RlLlxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdrZXlkb3duJywgZGVmZXJVcGRhdGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ3Bhc3RlJywgZGVmZXJVcGRhdGVNb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIG9uRXZlbnQoJ2N1dCcsIGRlZmVyVXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3BlcmFWZXJzaW9uIDwgMTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmEgMTAgZG9lc24ndCBhbHdheXMgZmlyZSB0aGUgJ2lucHV0JyBldmVudCBmb3IgY3V0LCBwYXN0ZSwgdW5kbyAmIGRyb3Agb3BlcmF0aW9ucy5cbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgY2FuIHRyeSB0byBjYXRjaCBzb21lIG9mIHRob3NlIHVzaW5nICdrZXlkb3duJy5cbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgna2V5ZG93bicsIGRlZmVyVXBkYXRlTW9kZWwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmlyZWZveFZlcnNpb24gPCA0LjApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyZWZveCA8PSAzLjYgZG9lc24ndCBmaXJlIHRoZSAnaW5wdXQnIGV2ZW50IHdoZW4gdGV4dCBpcyBmaWxsZWQgaW4gdGhyb3VnaCBhdXRvY29tcGxldGVcbiAgICAgICAgICAgICAgICAgICAgb25FdmVudCgnRE9NQXV0b0NvbXBsZXRlJywgdXBkYXRlTW9kZWwpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpcmVmb3ggPD0zLjUgZG9lc24ndCBmaXJlIHRoZSAnaW5wdXQnIGV2ZW50IHdoZW4gdGV4dCBpcyBkcm9wcGVkIGludG8gdGhlIGlucHV0LlxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdkcmFnZHJvcCcsIHVwZGF0ZU1vZGVsKTsgICAgICAgLy8gPDMuNVxuICAgICAgICAgICAgICAgICAgICBvbkV2ZW50KCdkcm9wJywgdXBkYXRlTW9kZWwpOyAgICAgICAgICAgLy8gMy41XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmluZCB0byB0aGUgY2hhbmdlIGV2ZW50IHNvIHRoYXQgd2UgY2FuIGNhdGNoIHByb2dyYW1tYXRpYyB1cGRhdGVzIG9mIHRoZSB2YWx1ZSB0aGF0IGZpcmUgdGhpcyBldmVudC5cbiAgICAgICAgb25FdmVudCgnY2hhbmdlJywgdXBkYXRlTW9kZWwpO1xuXG4gICAgICAgIGtvLmNvbXB1dGVkKHVwZGF0ZVZpZXcsIG51bGwsIHsgZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkOiBlbGVtZW50IH0pO1xuICAgIH1cbn07XG5rby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzWyd0ZXh0SW5wdXQnXSA9IHRydWU7XG5cbi8vIHRleHRpbnB1dCBpcyBhbiBhbGlhcyBmb3IgdGV4dElucHV0XG5rby5iaW5kaW5nSGFuZGxlcnNbJ3RleHRpbnB1dCddID0ge1xuICAgIC8vIHByZXByb2Nlc3MgaXMgdGhlIG9ubHkgd2F5IHRvIHNldCB1cCBhIGZ1bGwgYWxpYXNcbiAgICAncHJlcHJvY2Vzcyc6IGZ1bmN0aW9uICh2YWx1ZSwgbmFtZSwgYWRkQmluZGluZykge1xuICAgICAgICBhZGRCaW5kaW5nKCd0ZXh0SW5wdXQnLCB2YWx1ZSk7XG4gICAgfVxufTtcblxufSkoKTtrby5iaW5kaW5nSGFuZGxlcnNbJ3VuaXF1ZU5hbWUnXSA9IHtcbiAgICAnaW5pdCc6IGZ1bmN0aW9uIChlbGVtZW50LCB2YWx1ZUFjY2Vzc29yKSB7XG4gICAgICAgIGlmICh2YWx1ZUFjY2Vzc29yKCkpIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gXCJrb191bmlxdWVfXCIgKyAoKytrby5iaW5kaW5nSGFuZGxlcnNbJ3VuaXF1ZU5hbWUnXS5jdXJyZW50SW5kZXgpO1xuICAgICAgICAgICAga28udXRpbHMuc2V0RWxlbWVudE5hbWUoZWxlbWVudCwgbmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xua28uYmluZGluZ0hhbmRsZXJzWyd1bmlxdWVOYW1lJ10uY3VycmVudEluZGV4ID0gMDtcbmtvLmJpbmRpbmdIYW5kbGVyc1sndmFsdWUnXSA9IHtcbiAgICAnYWZ0ZXInOiBbJ29wdGlvbnMnLCAnZm9yZWFjaCddLFxuICAgICdpbml0JzogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGFsbEJpbmRpbmdzKSB7XG4gICAgICAgIC8vIElmIHRoZSB2YWx1ZSBiaW5kaW5nIGlzIHBsYWNlZCBvbiBhIHJhZGlvL2NoZWNrYm94LCB0aGVuIGp1c3QgcGFzcyB0aHJvdWdoIHRvIGNoZWNrZWRWYWx1ZSBhbmQgcXVpdFxuICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT0gXCJpbnB1dFwiICYmIChlbGVtZW50LnR5cGUgPT0gXCJjaGVja2JveFwiIHx8IGVsZW1lbnQudHlwZSA9PSBcInJhZGlvXCIpKSB7XG4gICAgICAgICAgICBrby5hcHBseUJpbmRpbmdBY2Nlc3NvcnNUb05vZGUoZWxlbWVudCwgeyAnY2hlY2tlZFZhbHVlJzogdmFsdWVBY2Nlc3NvciB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsd2F5cyBjYXRjaCBcImNoYW5nZVwiIGV2ZW50OyBwb3NzaWJseSBvdGhlciBldmVudHMgdG9vIGlmIGFza2VkXG4gICAgICAgIHZhciBldmVudHNUb0NhdGNoID0gW1wiY2hhbmdlXCJdO1xuICAgICAgICB2YXIgcmVxdWVzdGVkRXZlbnRzVG9DYXRjaCA9IGFsbEJpbmRpbmdzLmdldChcInZhbHVlVXBkYXRlXCIpO1xuICAgICAgICB2YXIgcHJvcGVydHlDaGFuZ2VkRmlyZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50ID0gbnVsbDtcblxuICAgICAgICBpZiAocmVxdWVzdGVkRXZlbnRzVG9DYXRjaCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0ZWRFdmVudHNUb0NhdGNoID09IFwic3RyaW5nXCIpIC8vIEFsbG93IGJvdGggaW5kaXZpZHVhbCBldmVudCBuYW1lcywgYW5kIGFycmF5cyBvZiBldmVudCBuYW1lc1xuICAgICAgICAgICAgICAgIHJlcXVlc3RlZEV2ZW50c1RvQ2F0Y2ggPSBbcmVxdWVzdGVkRXZlbnRzVG9DYXRjaF07XG4gICAgICAgICAgICBrby51dGlscy5hcnJheVB1c2hBbGwoZXZlbnRzVG9DYXRjaCwgcmVxdWVzdGVkRXZlbnRzVG9DYXRjaCk7XG4gICAgICAgICAgICBldmVudHNUb0NhdGNoID0ga28udXRpbHMuYXJyYXlHZXREaXN0aW5jdFZhbHVlcyhldmVudHNUb0NhdGNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2YWx1ZVVwZGF0ZUhhbmRsZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50ID0gbnVsbDtcbiAgICAgICAgICAgIHByb3BlcnR5Q2hhbmdlZEZpcmVkID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgbW9kZWxWYWx1ZSA9IHZhbHVlQWNjZXNzb3IoKTtcbiAgICAgICAgICAgIHZhciBlbGVtZW50VmFsdWUgPSBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZShlbGVtZW50KTtcbiAgICAgICAgICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcud3JpdGVWYWx1ZVRvUHJvcGVydHkobW9kZWxWYWx1ZSwgYWxsQmluZGluZ3MsICd2YWx1ZScsIGVsZW1lbnRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBodHRwczovL2dpdGh1Yi5jb20vU3RldmVTYW5kZXJzb24va25vY2tvdXQvaXNzdWVzLzEyMlxuICAgICAgICAvLyBJRSBkb2Vzbid0IGZpcmUgXCJjaGFuZ2VcIiBldmVudHMgb24gdGV4dGJveGVzIGlmIHRoZSB1c2VyIHNlbGVjdHMgYSB2YWx1ZSBmcm9tIGl0cyBhdXRvY29tcGxldGUgbGlzdFxuICAgICAgICB2YXIgaWVBdXRvQ29tcGxldGVIYWNrTmVlZGVkID0ga28udXRpbHMuaWVWZXJzaW9uICYmIGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09IFwiaW5wdXRcIiAmJiBlbGVtZW50LnR5cGUgPT0gXCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIGVsZW1lbnQuYXV0b2NvbXBsZXRlICE9IFwib2ZmXCIgJiYgKCFlbGVtZW50LmZvcm0gfHwgZWxlbWVudC5mb3JtLmF1dG9jb21wbGV0ZSAhPSBcIm9mZlwiKTtcbiAgICAgICAgaWYgKGllQXV0b0NvbXBsZXRlSGFja05lZWRlZCAmJiBrby51dGlscy5hcnJheUluZGV4T2YoZXZlbnRzVG9DYXRjaCwgXCJwcm9wZXJ0eWNoYW5nZVwiKSA9PSAtMSkge1xuICAgICAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJwcm9wZXJ0eWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7IHByb3BlcnR5Q2hhbmdlZEZpcmVkID0gdHJ1ZSB9KTtcbiAgICAgICAgICAgIGtvLnV0aWxzLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGVsZW1lbnQsIFwiZm9jdXNcIiwgZnVuY3Rpb24gKCkgeyBwcm9wZXJ0eUNoYW5nZWRGaXJlZCA9IGZhbHNlIH0pO1xuICAgICAgICAgICAga28udXRpbHMucmVnaXN0ZXJFdmVudEhhbmRsZXIoZWxlbWVudCwgXCJibHVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eUNoYW5nZWRGaXJlZCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZVVwZGF0ZUhhbmRsZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGtvLnV0aWxzLmFycmF5Rm9yRWFjaChldmVudHNUb0NhdGNoLCBmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgICAgICAgICAgIC8vIFRoZSBzeW50YXggXCJhZnRlcjxldmVudG5hbWU+XCIgbWVhbnMgXCJydW4gdGhlIGhhbmRsZXIgYXN5bmNocm9ub3VzbHkgYWZ0ZXIgdGhlIGV2ZW50XCJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdXNlZnVsLCBmb3IgZXhhbXBsZSwgdG8gY2F0Y2ggXCJrZXlkb3duXCIgZXZlbnRzIGFmdGVyIHRoZSBicm93c2VyIGhhcyB1cGRhdGVkIHRoZSBjb250cm9sXG4gICAgICAgICAgICAvLyAob3RoZXJ3aXNlLCBrby5zZWxlY3RFeHRlbnNpb25zLnJlYWRWYWx1ZSh0aGlzKSB3aWxsIHJlY2VpdmUgdGhlIGNvbnRyb2wncyB2YWx1ZSAqYmVmb3JlKiB0aGUga2V5IGV2ZW50KVxuICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSB2YWx1ZVVwZGF0ZUhhbmRsZXI7XG4gICAgICAgICAgICBpZiAoa28udXRpbHMuc3RyaW5nU3RhcnRzV2l0aChldmVudE5hbWUsIFwiYWZ0ZXJcIikpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBlbGVtZW50VmFsdWVCZWZvcmVFdmVudCB2YXJpYWJsZSBpcyBub24tbnVsbCAqb25seSogZHVyaW5nIHRoZSBicmllZiBnYXAgYmV0d2VlblxuICAgICAgICAgICAgICAgICAgICAvLyBhIGtleVggZXZlbnQgZmlyaW5nIGFuZCB0aGUgdmFsdWVVcGRhdGVIYW5kbGVyIHJ1bm5pbmcsIHdoaWNoIGlzIHNjaGVkdWxlZCB0byBoYXBwZW5cbiAgICAgICAgICAgICAgICAgICAgLy8gYXQgdGhlIGVhcmxpZXN0IGFzeW5jaHJvbm91cyBvcHBvcnR1bml0eS4gV2Ugc3RvcmUgdGhpcyB0ZW1wb3JhcnkgaW5mb3JtYXRpb24gc28gdGhhdFxuICAgICAgICAgICAgICAgICAgICAvLyBpZiwgYmV0d2VlbiBrZXlYIGFuZCB2YWx1ZVVwZGF0ZUhhbmRsZXIsIHRoZSB1bmRlcmx5aW5nIG1vZGVsIHZhbHVlIGNoYW5nZXMgc2VwYXJhdGVseSxcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgY2FuIG92ZXJ3cml0ZSB0aGF0IG1vZGVsIHZhbHVlIGNoYW5nZSB3aXRoIHRoZSB2YWx1ZSB0aGUgdXNlciBqdXN0IHR5cGVkLiBPdGhlcndpc2UsXG4gICAgICAgICAgICAgICAgICAgIC8vIHRlY2huaXF1ZXMgbGlrZSByYXRlTGltaXQgY2FuIHRyaWdnZXIgbW9kZWwgY2hhbmdlcyBhdCBjcml0aWNhbCBtb21lbnRzIHRoYXQgd2lsbFxuICAgICAgICAgICAgICAgICAgICAvLyBvdmVycmlkZSB0aGUgdXNlcidzIGlucHV0cywgY2F1c2luZyBrZXlzdHJva2VzIHRvIGJlIGxvc3QuXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50ID0ga28uc2VsZWN0RXh0ZW5zaW9ucy5yZWFkVmFsdWUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIGtvLnV0aWxzLnNldFRpbWVvdXQodmFsdWVVcGRhdGVIYW5kbGVyLCAwKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGV2ZW50TmFtZSA9IGV2ZW50TmFtZS5zdWJzdHJpbmcoXCJhZnRlclwiLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrby51dGlscy5yZWdpc3RlckV2ZW50SGFuZGxlcihlbGVtZW50LCBldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdXBkYXRlRnJvbU1vZGVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZUFjY2Vzc29yKCkpO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRWYWx1ZSA9IGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICBpZiAoZWxlbWVudFZhbHVlQmVmb3JlRXZlbnQgIT09IG51bGwgJiYgbmV3VmFsdWUgPT09IGVsZW1lbnRWYWx1ZUJlZm9yZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAga28udXRpbHMuc2V0VGltZW91dCh1cGRhdGVGcm9tTW9kZWwsIDApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHZhbHVlSGFzQ2hhbmdlZCA9IChuZXdWYWx1ZSAhPT0gZWxlbWVudFZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlSGFzQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIGlmIChrby51dGlscy50YWdOYW1lTG93ZXIoZWxlbWVudCkgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFsbG93VW5zZXQgPSBhbGxCaW5kaW5ncy5nZXQoJ3ZhbHVlQWxsb3dVbnNldCcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXBwbHlWYWx1ZUFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZShlbGVtZW50LCBuZXdWYWx1ZSwgYWxsb3dVbnNldCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGFwcGx5VmFsdWVBY3Rpb24oKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWFsbG93VW5zZXQgJiYgbmV3VmFsdWUgIT09IGtvLnNlbGVjdEV4dGVuc2lvbnMucmVhZFZhbHVlKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB5b3UgdHJ5IHRvIHNldCBhIG1vZGVsIHZhbHVlIHRoYXQgY2FuJ3QgYmUgcmVwcmVzZW50ZWQgaW4gYW4gYWxyZWFkeS1wb3B1bGF0ZWQgZHJvcGRvd24sIHJlamVjdCB0aGF0IGNoYW5nZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgeW91J3JlIG5vdCBhbGxvd2VkIHRvIGhhdmUgYSBtb2RlbCB2YWx1ZSB0aGF0IGRpc2FncmVlcyB3aXRoIGEgdmlzaWJsZSBVSSBzZWxlY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShrby51dGlscy50cmlnZ2VyRXZlbnQsIG51bGwsIFtlbGVtZW50LCBcImNoYW5nZVwiXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBJRTYgYnVnOiBJdCB3b24ndCByZWxpYWJseSBhcHBseSB2YWx1ZXMgdG8gU0VMRUNUIG5vZGVzIGR1cmluZyB0aGUgc2FtZSBleGVjdXRpb24gdGhyZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByaWdodCBhZnRlciB5b3UndmUgY2hhbmdlZCB0aGUgc2V0IG9mIE9QVElPTiBub2RlcyBvbiBpdC4gU28gZm9yIHRoYXQgbm9kZSB0eXBlLCB3ZSdsbCBzY2hlZHVsZSBhIHNlY29uZCB0aHJlYWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvIGFwcGx5IHRoZSB2YWx1ZSBhcyB3ZWxsLlxuICAgICAgICAgICAgICAgICAgICAgICAga28udXRpbHMuc2V0VGltZW91dChhcHBseVZhbHVlQWN0aW9uLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGtvLnNlbGVjdEV4dGVuc2lvbnMud3JpdGVWYWx1ZShlbGVtZW50LCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGtvLmNvbXB1dGVkKHVwZGF0ZUZyb21Nb2RlbCwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGVsZW1lbnQgfSk7XG4gICAgfSxcbiAgICAndXBkYXRlJzogZnVuY3Rpb24oKSB7fSAvLyBLZWVwIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIGNvZGUgdGhhdCBtYXkgaGF2ZSB3cmFwcGVkIHZhbHVlIGJpbmRpbmdcbn07XG5rby5leHByZXNzaW9uUmV3cml0aW5nLnR3b1dheUJpbmRpbmdzWyd2YWx1ZSddID0gdHJ1ZTtcbmtvLmJpbmRpbmdIYW5kbGVyc1sndmlzaWJsZSddID0ge1xuICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3Nvcikge1xuICAgICAgICB2YXIgdmFsdWUgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKHZhbHVlQWNjZXNzb3IoKSk7XG4gICAgICAgIHZhciBpc0N1cnJlbnRseVZpc2libGUgPSAhKGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9PSBcIm5vbmVcIik7XG4gICAgICAgIGlmICh2YWx1ZSAmJiAhaXNDdXJyZW50bHlWaXNpYmxlKVxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgZWxzZSBpZiAoKCF2YWx1ZSkgJiYgaXNDdXJyZW50bHlWaXNpYmxlKVxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxufTtcbi8vICdjbGljaycgaXMganVzdCBhIHNob3J0aGFuZCBmb3IgdGhlIHVzdWFsIGZ1bGwtbGVuZ3RoIGV2ZW50OntjbGljazpoYW5kbGVyfVxubWFrZUV2ZW50SGFuZGxlclNob3J0Y3V0KCdjbGljaycpO1xuLy8gSWYgeW91IHdhbnQgdG8gbWFrZSBhIGN1c3RvbSB0ZW1wbGF0ZSBlbmdpbmUsXG4vL1xuLy8gWzFdIEluaGVyaXQgZnJvbSB0aGlzIGNsYXNzIChsaWtlIGtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lIGRvZXMpXG4vLyBbMl0gT3ZlcnJpZGUgJ3JlbmRlclRlbXBsYXRlU291cmNlJywgc3VwcGx5aW5nIGEgZnVuY3Rpb24gd2l0aCB0aGlzIHNpZ25hdHVyZTpcbi8vXG4vLyAgICAgICAgZnVuY3Rpb24gKHRlbXBsYXRlU291cmNlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucykge1xuLy8gICAgICAgICAgICAvLyAtIHRlbXBsYXRlU291cmNlLnRleHQoKSBpcyB0aGUgdGV4dCBvZiB0aGUgdGVtcGxhdGUgeW91IHNob3VsZCByZW5kZXJcbi8vICAgICAgICAgICAgLy8gLSBiaW5kaW5nQ29udGV4dC4kZGF0YSBpcyB0aGUgZGF0YSB5b3Ugc2hvdWxkIHBhc3MgaW50byB0aGUgdGVtcGxhdGVcbi8vICAgICAgICAgICAgLy8gICAtIHlvdSBtaWdodCBhbHNvIHdhbnQgdG8gbWFrZSBiaW5kaW5nQ29udGV4dC4kcGFyZW50LCBiaW5kaW5nQ29udGV4dC4kcGFyZW50cyxcbi8vICAgICAgICAgICAgLy8gICAgIGFuZCBiaW5kaW5nQ29udGV4dC4kcm9vdCBhdmFpbGFibGUgaW4gdGhlIHRlbXBsYXRlIHRvb1xuLy8gICAgICAgICAgICAvLyAtIG9wdGlvbnMgZ2l2ZXMgeW91IGFjY2VzcyB0byBhbnkgb3RoZXIgcHJvcGVydGllcyBzZXQgb24gXCJkYXRhLWJpbmQ6IHsgdGVtcGxhdGU6IG9wdGlvbnMgfVwiXG4vLyAgICAgICAgICAgIC8vIC0gdGVtcGxhdGVEb2N1bWVudCBpcyB0aGUgZG9jdW1lbnQgb2JqZWN0IG9mIHRoZSB0ZW1wbGF0ZVxuLy8gICAgICAgICAgICAvL1xuLy8gICAgICAgICAgICAvLyBSZXR1cm4gdmFsdWU6IGFuIGFycmF5IG9mIERPTSBub2Rlc1xuLy8gICAgICAgIH1cbi8vXG4vLyBbM10gT3ZlcnJpZGUgJ2NyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9jaycsIHN1cHBseWluZyBhIGZ1bmN0aW9uIHdpdGggdGhpcyBzaWduYXR1cmU6XG4vL1xuLy8gICAgICAgIGZ1bmN0aW9uIChzY3JpcHQpIHtcbi8vICAgICAgICAgICAgLy8gUmV0dXJuIHZhbHVlOiBXaGF0ZXZlciBzeW50YXggbWVhbnMgXCJFdmFsdWF0ZSB0aGUgSmF2YVNjcmlwdCBzdGF0ZW1lbnQgJ3NjcmlwdCcgYW5kIG91dHB1dCB0aGUgcmVzdWx0XCJcbi8vICAgICAgICAgICAgLy8gICAgICAgICAgICAgICBGb3IgZXhhbXBsZSwgdGhlIGpxdWVyeS50bXBsIHRlbXBsYXRlIGVuZ2luZSBjb252ZXJ0cyAnc29tZVNjcmlwdCcgdG8gJyR7IHNvbWVTY3JpcHQgfSdcbi8vICAgICAgICB9XG4vL1xuLy8gICAgIFRoaXMgaXMgb25seSBuZWNlc3NhcnkgaWYgeW91IHdhbnQgdG8gYWxsb3cgZGF0YS1iaW5kIGF0dHJpYnV0ZXMgdG8gcmVmZXJlbmNlIGFyYml0cmFyeSB0ZW1wbGF0ZSB2YXJpYWJsZXMuXG4vLyAgICAgSWYgeW91IGRvbid0IHdhbnQgdG8gYWxsb3cgdGhhdCwgeW91IGNhbiBzZXQgdGhlIHByb3BlcnR5ICdhbGxvd1RlbXBsYXRlUmV3cml0aW5nJyB0byBmYWxzZSAobGlrZSBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZSBkb2VzKVxuLy8gICAgIGFuZCB0aGVuIHlvdSBkb24ndCBuZWVkIHRvIG92ZXJyaWRlICdjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2snLlxuXG5rby50ZW1wbGF0ZUVuZ2luZSA9IGZ1bmN0aW9uICgpIHsgfTtcblxua28udGVtcGxhdGVFbmdpbmUucHJvdG90eXBlWydyZW5kZXJUZW1wbGF0ZVNvdXJjZSddID0gZnVuY3Rpb24gKHRlbXBsYXRlU291cmNlLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucywgdGVtcGxhdGVEb2N1bWVudCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk92ZXJyaWRlIHJlbmRlclRlbXBsYXRlU291cmNlXCIpO1xufTtcblxua28udGVtcGxhdGVFbmdpbmUucHJvdG90eXBlWydjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2snXSA9IGZ1bmN0aW9uIChzY3JpcHQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJPdmVycmlkZSBjcmVhdGVKYXZhU2NyaXB0RXZhbHVhdG9yQmxvY2tcIik7XG59O1xuXG5rby50ZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGVbJ21ha2VUZW1wbGF0ZVNvdXJjZSddID0gZnVuY3Rpb24odGVtcGxhdGUsIHRlbXBsYXRlRG9jdW1lbnQpIHtcbiAgICAvLyBOYW1lZCB0ZW1wbGF0ZVxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0ZW1wbGF0ZURvY3VtZW50ID0gdGVtcGxhdGVEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICAgICAgdmFyIGVsZW0gPSB0ZW1wbGF0ZURvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlKTtcbiAgICAgICAgaWYgKCFlbGVtKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgdGVtcGxhdGUgd2l0aCBJRCBcIiArIHRlbXBsYXRlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudChlbGVtKTtcbiAgICB9IGVsc2UgaWYgKCh0ZW1wbGF0ZS5ub2RlVHlwZSA9PSAxKSB8fCAodGVtcGxhdGUubm9kZVR5cGUgPT0gOCkpIHtcbiAgICAgICAgLy8gQW5vbnltb3VzIHRlbXBsYXRlXG4gICAgICAgIHJldHVybiBuZXcga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlKHRlbXBsYXRlKTtcbiAgICB9IGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biB0ZW1wbGF0ZSB0eXBlOiBcIiArIHRlbXBsYXRlKTtcbn07XG5cbmtvLnRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsncmVuZGVyVGVtcGxhdGUnXSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMsIHRlbXBsYXRlRG9jdW1lbnQpIHtcbiAgICB2YXIgdGVtcGxhdGVTb3VyY2UgPSB0aGlzWydtYWtlVGVtcGxhdGVTb3VyY2UnXSh0ZW1wbGF0ZSwgdGVtcGxhdGVEb2N1bWVudCk7XG4gICAgcmV0dXJuIHRoaXNbJ3JlbmRlclRlbXBsYXRlU291cmNlJ10odGVtcGxhdGVTb3VyY2UsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zLCB0ZW1wbGF0ZURvY3VtZW50KTtcbn07XG5cbmtvLnRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsnaXNUZW1wbGF0ZVJld3JpdHRlbiddID0gZnVuY3Rpb24gKHRlbXBsYXRlLCB0ZW1wbGF0ZURvY3VtZW50KSB7XG4gICAgLy8gU2tpcCByZXdyaXRpbmcgaWYgcmVxdWVzdGVkXG4gICAgaWYgKHRoaXNbJ2FsbG93VGVtcGxhdGVSZXdyaXRpbmcnXSA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiB0aGlzWydtYWtlVGVtcGxhdGVTb3VyY2UnXSh0ZW1wbGF0ZSwgdGVtcGxhdGVEb2N1bWVudClbJ2RhdGEnXShcImlzUmV3cml0dGVuXCIpO1xufTtcblxua28udGVtcGxhdGVFbmdpbmUucHJvdG90eXBlWydyZXdyaXRlVGVtcGxhdGUnXSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgcmV3cml0ZXJDYWxsYmFjaywgdGVtcGxhdGVEb2N1bWVudCkge1xuICAgIHZhciB0ZW1wbGF0ZVNvdXJjZSA9IHRoaXNbJ21ha2VUZW1wbGF0ZVNvdXJjZSddKHRlbXBsYXRlLCB0ZW1wbGF0ZURvY3VtZW50KTtcbiAgICB2YXIgcmV3cml0dGVuID0gcmV3cml0ZXJDYWxsYmFjayh0ZW1wbGF0ZVNvdXJjZVsndGV4dCddKCkpO1xuICAgIHRlbXBsYXRlU291cmNlWyd0ZXh0J10ocmV3cml0dGVuKTtcbiAgICB0ZW1wbGF0ZVNvdXJjZVsnZGF0YSddKFwiaXNSZXdyaXR0ZW5cIiwgdHJ1ZSk7XG59O1xuXG5rby5leHBvcnRTeW1ib2woJ3RlbXBsYXRlRW5naW5lJywga28udGVtcGxhdGVFbmdpbmUpO1xuXG5rby50ZW1wbGF0ZVJld3JpdGluZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1lbW9pemVEYXRhQmluZGluZ0F0dHJpYnV0ZVN5bnRheFJlZ2V4ID0gLyg8KFthLXpdK1xcZCopKD86XFxzKyg/IWRhdGEtYmluZFxccyo9XFxzKilbYS16MC05XFwtXSsoPzo9KD86XFxcIlteXFxcIl0qXFxcInxcXCdbXlxcJ10qXFwnfFtePl0qKSk/KSpcXHMrKWRhdGEtYmluZFxccyo9XFxzKihbXCInXSkoW1xcc1xcU10qPylcXDMvZ2k7XG4gICAgdmFyIG1lbW9pemVWaXJ0dWFsQ29udGFpbmVyQmluZGluZ1N5bnRheFJlZ2V4ID0gLzwhLS1cXHMqa29cXGJcXHMqKFtcXHNcXFNdKj8pXFxzKi0tPi9nO1xuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVEYXRhQmluZFZhbHVlc0ZvclJld3JpdGluZyhrZXlWYWx1ZUFycmF5KSB7XG4gICAgICAgIHZhciBhbGxWYWxpZGF0b3JzID0ga28uZXhwcmVzc2lvblJld3JpdGluZy5iaW5kaW5nUmV3cml0ZVZhbGlkYXRvcnM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5VmFsdWVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleVZhbHVlQXJyYXlbaV1bJ2tleSddO1xuICAgICAgICAgICAgaWYgKGFsbFZhbGlkYXRvcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWxpZGF0b3IgPSBhbGxWYWxpZGF0b3JzW2tleV07XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbGlkYXRvciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3NzaWJsZUVycm9yTWVzc2FnZSA9IHZhbGlkYXRvcihrZXlWYWx1ZUFycmF5W2ldWyd2YWx1ZSddKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc3NpYmxlRXJyb3JNZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBvc3NpYmxlRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF2YWxpZGF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyB0ZW1wbGF0ZSBlbmdpbmUgZG9lcyBub3Qgc3VwcG9ydCB0aGUgJ1wiICsga2V5ICsgXCInIGJpbmRpbmcgd2l0aGluIGl0cyB0ZW1wbGF0ZXNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uc3RydWN0TWVtb2l6ZWRUYWdSZXBsYWNlbWVudChkYXRhQmluZEF0dHJpYnV0ZVZhbHVlLCB0YWdUb1JldGFpbiwgbm9kZU5hbWUsIHRlbXBsYXRlRW5naW5lKSB7XG4gICAgICAgIHZhciBkYXRhQmluZEtleVZhbHVlQXJyYXkgPSBrby5leHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbChkYXRhQmluZEF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgICAgdmFsaWRhdGVEYXRhQmluZFZhbHVlc0ZvclJld3JpdGluZyhkYXRhQmluZEtleVZhbHVlQXJyYXkpO1xuICAgICAgICB2YXIgcmV3cml0dGVuRGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZSA9IGtvLmV4cHJlc3Npb25SZXdyaXRpbmcucHJlUHJvY2Vzc0JpbmRpbmdzKGRhdGFCaW5kS2V5VmFsdWVBcnJheSwgeyd2YWx1ZUFjY2Vzc29ycyc6dHJ1ZX0pO1xuXG4gICAgICAgIC8vIEZvciBubyBvYnZpb3VzIHJlYXNvbiwgT3BlcmEgZmFpbHMgdG8gZXZhbHVhdGUgcmV3cml0dGVuRGF0YUJpbmRBdHRyaWJ1dGVWYWx1ZSB1bmxlc3MgaXQncyB3cmFwcGVkIGluIGFuIGFkZGl0aW9uYWxcbiAgICAgICAgLy8gYW5vbnltb3VzIGZ1bmN0aW9uLCBldmVuIHRob3VnaCBPcGVyYSdzIGJ1aWx0LWluIGRlYnVnZ2VyIGNhbiBldmFsdWF0ZSBpdCBhbnl3YXkuIE5vIG90aGVyIGJyb3dzZXIgcmVxdWlyZXMgdGhpc1xuICAgICAgICAvLyBleHRyYSBpbmRpcmVjdGlvbi5cbiAgICAgICAgdmFyIGFwcGx5QmluZGluZ3NUb05leHRTaWJsaW5nU2NyaXB0ID1cbiAgICAgICAgICAgIFwia28uX190cl9hbWJ0bnMoZnVuY3Rpb24oJGNvbnRleHQsJGVsZW1lbnQpe3JldHVybihmdW5jdGlvbigpe3JldHVybnsgXCIgKyByZXdyaXR0ZW5EYXRhQmluZEF0dHJpYnV0ZVZhbHVlICsgXCIgfSB9KSgpfSwnXCIgKyBub2RlTmFtZS50b0xvd2VyQ2FzZSgpICsgXCInKVwiO1xuICAgICAgICByZXR1cm4gdGVtcGxhdGVFbmdpbmVbJ2NyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9jayddKGFwcGx5QmluZGluZ3NUb05leHRTaWJsaW5nU2NyaXB0KSArIHRhZ1RvUmV0YWluO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGVuc3VyZVRlbXBsYXRlSXNSZXdyaXR0ZW46IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgdGVtcGxhdGVFbmdpbmUsIHRlbXBsYXRlRG9jdW1lbnQpIHtcbiAgICAgICAgICAgIGlmICghdGVtcGxhdGVFbmdpbmVbJ2lzVGVtcGxhdGVSZXdyaXR0ZW4nXSh0ZW1wbGF0ZSwgdGVtcGxhdGVEb2N1bWVudCkpXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVFbmdpbmVbJ3Jld3JpdGVUZW1wbGF0ZSddKHRlbXBsYXRlLCBmdW5jdGlvbiAoaHRtbFN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ga28udGVtcGxhdGVSZXdyaXRpbmcubWVtb2l6ZUJpbmRpbmdBdHRyaWJ1dGVTeW50YXgoaHRtbFN0cmluZywgdGVtcGxhdGVFbmdpbmUpO1xuICAgICAgICAgICAgICAgIH0sIHRlbXBsYXRlRG9jdW1lbnQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1lbW9pemVCaW5kaW5nQXR0cmlidXRlU3ludGF4OiBmdW5jdGlvbiAoaHRtbFN0cmluZywgdGVtcGxhdGVFbmdpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBodG1sU3RyaW5nLnJlcGxhY2UobWVtb2l6ZURhdGFCaW5kaW5nQXR0cmlidXRlU3ludGF4UmVnZXgsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc3RydWN0TWVtb2l6ZWRUYWdSZXBsYWNlbWVudCgvKiBkYXRhQmluZEF0dHJpYnV0ZVZhbHVlOiAqLyBhcmd1bWVudHNbNF0sIC8qIHRhZ1RvUmV0YWluOiAqLyBhcmd1bWVudHNbMV0sIC8qIG5vZGVOYW1lOiAqLyBhcmd1bWVudHNbMl0sIHRlbXBsYXRlRW5naW5lKTtcbiAgICAgICAgICAgIH0pLnJlcGxhY2UobWVtb2l6ZVZpcnR1YWxDb250YWluZXJCaW5kaW5nU3ludGF4UmVnZXgsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25zdHJ1Y3RNZW1vaXplZFRhZ1JlcGxhY2VtZW50KC8qIGRhdGFCaW5kQXR0cmlidXRlVmFsdWU6ICovIGFyZ3VtZW50c1sxXSwgLyogdGFnVG9SZXRhaW46ICovIFwiPCEtLSBrbyAtLT5cIiwgLyogbm9kZU5hbWU6ICovIFwiI2NvbW1lbnRcIiwgdGVtcGxhdGVFbmdpbmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXBwbHlNZW1vaXplZEJpbmRpbmdzVG9OZXh0U2libGluZzogZnVuY3Rpb24gKGJpbmRpbmdzLCBub2RlTmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGtvLm1lbW9pemF0aW9uLm1lbW9pemUoZnVuY3Rpb24gKGRvbU5vZGUsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGVUb0JpbmQgPSBkb21Ob2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmIChub2RlVG9CaW5kICYmIG5vZGVUb0JpbmQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbm9kZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAga28uYXBwbHlCaW5kaW5nQWNjZXNzb3JzVG9Ob2RlKG5vZGVUb0JpbmQsIGJpbmRpbmdzLCBiaW5kaW5nQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuXG5cbi8vIEV4cG9ydGVkIG9ubHkgYmVjYXVzZSBpdCBoYXMgdG8gYmUgcmVmZXJlbmNlZCBieSBzdHJpbmcgbG9va3VwIGZyb20gd2l0aGluIHJld3JpdHRlbiB0ZW1wbGF0ZVxua28uZXhwb3J0U3ltYm9sKCdfX3RyX2FtYnRucycsIGtvLnRlbXBsYXRlUmV3cml0aW5nLmFwcGx5TWVtb2l6ZWRCaW5kaW5nc1RvTmV4dFNpYmxpbmcpO1xuKGZ1bmN0aW9uKCkge1xuICAgIC8vIEEgdGVtcGxhdGUgc291cmNlIHJlcHJlc2VudHMgYSByZWFkL3dyaXRlIHdheSBvZiBhY2Nlc3NpbmcgYSB0ZW1wbGF0ZS4gVGhpcyBpcyB0byBlbGltaW5hdGUgdGhlIG5lZWQgZm9yIHRlbXBsYXRlIGxvYWRpbmcvc2F2aW5nXG4gICAgLy8gbG9naWMgdG8gYmUgZHVwbGljYXRlZCBpbiBldmVyeSB0ZW1wbGF0ZSBlbmdpbmUgKGFuZCBtZWFucyB0aGV5IGNhbiBhbGwgd29yayB3aXRoIGFub255bW91cyB0ZW1wbGF0ZXMsIGV0Yy4pXG4gICAgLy9cbiAgICAvLyBUd28gYXJlIHByb3ZpZGVkIGJ5IGRlZmF1bHQ6XG4gICAgLy8gIDEuIGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50ICAgICAgIC0gcmVhZHMvd3JpdGVzIHRoZSB0ZXh0IGNvbnRlbnQgb2YgYW4gYXJiaXRyYXJ5IERPTSBlbGVtZW50XG4gICAgLy8gIDIuIGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNFbGVtZW50IC0gdXNlcyBrby51dGlscy5kb21EYXRhIHRvIHJlYWQvd3JpdGUgdGV4dCAqYXNzb2NpYXRlZCogd2l0aCB0aGUgRE9NIGVsZW1lbnQsIGJ1dFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhvdXQgcmVhZGluZy93cml0aW5nIHRoZSBhY3R1YWwgZWxlbWVudCB0ZXh0IGNvbnRlbnQsIHNpbmNlIGl0IHdpbGwgYmUgb3ZlcndyaXR0ZW5cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aXRoIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZSBvdXRwdXQuXG4gICAgLy8gWW91IGNhbiBpbXBsZW1lbnQgeW91ciBvd24gdGVtcGxhdGUgc291cmNlIGlmIHlvdSB3YW50IHRvIGZldGNoL3N0b3JlIHRlbXBsYXRlcyBzb21ld2hlcmUgb3RoZXIgdGhhbiBpbiBET00gZWxlbWVudHMuXG4gICAgLy8gVGVtcGxhdGUgc291cmNlcyBuZWVkIHRvIGhhdmUgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnM6XG4gICAgLy8gICB0ZXh0KCkgXHRcdFx0LSByZXR1cm5zIHRoZSB0ZW1wbGF0ZSB0ZXh0IGZyb20geW91ciBzdG9yYWdlIGxvY2F0aW9uXG4gICAgLy8gICB0ZXh0KHZhbHVlKVx0XHQtIHdyaXRlcyB0aGUgc3VwcGxpZWQgdGVtcGxhdGUgdGV4dCB0byB5b3VyIHN0b3JhZ2UgbG9jYXRpb25cbiAgICAvLyAgIGRhdGEoa2V5KVx0XHRcdC0gcmVhZHMgdmFsdWVzIHN0b3JlZCB1c2luZyBkYXRhKGtleSwgdmFsdWUpIC0gc2VlIGJlbG93XG4gICAgLy8gICBkYXRhKGtleSwgdmFsdWUpXHQtIGFzc29jaWF0ZXMgXCJ2YWx1ZVwiIHdpdGggdGhpcyB0ZW1wbGF0ZSBhbmQgdGhlIGtleSBcImtleVwiLiBJcyB1c2VkIHRvIHN0b3JlIGluZm9ybWF0aW9uIGxpa2UgXCJpc1Jld3JpdHRlblwiLlxuICAgIC8vXG4gICAgLy8gT3B0aW9uYWxseSwgdGVtcGxhdGUgc291cmNlcyBjYW4gYWxzbyBoYXZlIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zOlxuICAgIC8vICAgbm9kZXMoKSAgICAgICAgICAgIC0gcmV0dXJucyBhIERPTSBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIG5vZGVzIG9mIHRoaXMgdGVtcGxhdGUsIHdoZXJlIGF2YWlsYWJsZVxuICAgIC8vICAgbm9kZXModmFsdWUpICAgICAgIC0gd3JpdGVzIHRoZSBnaXZlbiBET00gZWxlbWVudCB0byB5b3VyIHN0b3JhZ2UgbG9jYXRpb25cbiAgICAvLyBJZiBhIERPTSBlbGVtZW50IGlzIGF2YWlsYWJsZSBmb3IgYSBnaXZlbiB0ZW1wbGF0ZSBzb3VyY2UsIHRlbXBsYXRlIGVuZ2luZXMgYXJlIGVuY291cmFnZWQgdG8gdXNlIGl0IGluIHByZWZlcmVuY2Ugb3ZlciB0ZXh0KClcbiAgICAvLyBmb3IgaW1wcm92ZWQgc3BlZWQuIEhvd2V2ZXIsIGFsbCB0ZW1wbGF0ZVNvdXJjZXMgbXVzdCBzdXBwbHkgdGV4dCgpIGV2ZW4gaWYgdGhleSBkb24ndCBzdXBwbHkgbm9kZXMoKS5cbiAgICAvL1xuICAgIC8vIE9uY2UgeW91J3ZlIGltcGxlbWVudGVkIGEgdGVtcGxhdGVTb3VyY2UsIG1ha2UgeW91ciB0ZW1wbGF0ZSBlbmdpbmUgdXNlIGl0IGJ5IHN1YmNsYXNzaW5nIHdoYXRldmVyIHRlbXBsYXRlIGVuZ2luZSB5b3Ugd2VyZVxuICAgIC8vIHVzaW5nIGFuZCBvdmVycmlkaW5nIFwibWFrZVRlbXBsYXRlU291cmNlXCIgdG8gcmV0dXJuIGFuIGluc3RhbmNlIG9mIHlvdXIgY3VzdG9tIHRlbXBsYXRlIHNvdXJjZS5cblxuICAgIGtvLnRlbXBsYXRlU291cmNlcyA9IHt9O1xuXG4gICAgLy8gLS0tLSBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudCAtLS0tLVxuXG4gICAgLy8gdGVtcGxhdGUgdHlwZXNcbiAgICB2YXIgdGVtcGxhdGVTY3JpcHQgPSAxLFxuICAgICAgICB0ZW1wbGF0ZVRleHRBcmVhID0gMixcbiAgICAgICAgdGVtcGxhdGVUZW1wbGF0ZSA9IDMsXG4gICAgICAgIHRlbXBsYXRlRWxlbWVudCA9IDQ7XG5cbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudCA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5kb21FbGVtZW50ID0gZWxlbWVudDtcblxuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIHRhZ05hbWVMb3dlciA9IGtvLnV0aWxzLnRhZ05hbWVMb3dlcihlbGVtZW50KTtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGVUeXBlID1cbiAgICAgICAgICAgICAgICB0YWdOYW1lTG93ZXIgPT09IFwic2NyaXB0XCIgPyB0ZW1wbGF0ZVNjcmlwdCA6XG4gICAgICAgICAgICAgICAgdGFnTmFtZUxvd2VyID09PSBcInRleHRhcmVhXCIgPyB0ZW1wbGF0ZVRleHRBcmVhIDpcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGJyb3dzZXJzIHdpdGggcHJvcGVyIDx0ZW1wbGF0ZT4gZWxlbWVudCBzdXBwb3J0LCB3aGVyZSB0aGUgLmNvbnRlbnQgcHJvcGVydHkgZ2l2ZXMgYSBkb2N1bWVudCBmcmFnbWVudFxuICAgICAgICAgICAgICAgIHRhZ05hbWVMb3dlciA9PSBcInRlbXBsYXRlXCIgJiYgZWxlbWVudC5jb250ZW50ICYmIGVsZW1lbnQuY29udGVudC5ub2RlVHlwZSA9PT0gMTEgPyB0ZW1wbGF0ZVRlbXBsYXRlIDpcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudC5wcm90b3R5cGVbJ3RleHQnXSA9IGZ1bmN0aW9uKC8qIHZhbHVlVG9Xcml0ZSAqLykge1xuICAgICAgICB2YXIgZWxlbUNvbnRlbnRzUHJvcGVydHkgPSB0aGlzLnRlbXBsYXRlVHlwZSA9PT0gdGVtcGxhdGVTY3JpcHQgPyBcInRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnRlbXBsYXRlVHlwZSA9PT0gdGVtcGxhdGVUZXh0QXJlYSA/IFwidmFsdWVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcImlubmVySFRNTFwiO1xuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRvbUVsZW1lbnRbZWxlbUNvbnRlbnRzUHJvcGVydHldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHZhbHVlVG9Xcml0ZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIGlmIChlbGVtQ29udGVudHNQcm9wZXJ0eSA9PT0gXCJpbm5lckhUTUxcIilcbiAgICAgICAgICAgICAgICBrby51dGlscy5zZXRIdG1sKHRoaXMuZG9tRWxlbWVudCwgdmFsdWVUb1dyaXRlKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmRvbUVsZW1lbnRbZWxlbUNvbnRlbnRzUHJvcGVydHldID0gdmFsdWVUb1dyaXRlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBkYXRhRG9tRGF0YVByZWZpeCA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpICsgXCJfXCI7XG4gICAga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQucHJvdG90eXBlWydkYXRhJ10gPSBmdW5jdGlvbihrZXkgLyosIHZhbHVlVG9Xcml0ZSAqLykge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGtvLnV0aWxzLmRvbURhdGEuZ2V0KHRoaXMuZG9tRWxlbWVudCwgZGF0YURvbURhdGFQcmVmaXggKyBrZXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQodGhpcy5kb21FbGVtZW50LCBkYXRhRG9tRGF0YVByZWZpeCArIGtleSwgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgdGVtcGxhdGVzRG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xuICAgIGZ1bmN0aW9uIGdldFRlbXBsYXRlRG9tRGF0YShlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBrby51dGlscy5kb21EYXRhLmdldChlbGVtZW50LCB0ZW1wbGF0ZXNEb21EYXRhS2V5KSB8fCB7fTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0VGVtcGxhdGVEb21EYXRhKGVsZW1lbnQsIGRhdGEpIHtcbiAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQoZWxlbWVudCwgdGVtcGxhdGVzRG9tRGF0YUtleSwgZGF0YSk7XG4gICAgfVxuXG4gICAga28udGVtcGxhdGVTb3VyY2VzLmRvbUVsZW1lbnQucHJvdG90eXBlWydub2RlcyddID0gZnVuY3Rpb24oLyogdmFsdWVUb1dyaXRlICovKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5kb21FbGVtZW50O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB2YXIgdGVtcGxhdGVEYXRhID0gZ2V0VGVtcGxhdGVEb21EYXRhKGVsZW1lbnQpLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5lckRhdGEgPSB0ZW1wbGF0ZURhdGEuY29udGFpbmVyRGF0YTtcbiAgICAgICAgICAgIHJldHVybiBjb250YWluZXJEYXRhIHx8IChcbiAgICAgICAgICAgICAgICB0aGlzLnRlbXBsYXRlVHlwZSA9PT0gdGVtcGxhdGVUZW1wbGF0ZSA/IGVsZW1lbnQuY29udGVudCA6XG4gICAgICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZVR5cGUgPT09IHRlbXBsYXRlRWxlbWVudCA/IGVsZW1lbnQgOlxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdmFsdWVUb1dyaXRlID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgc2V0VGVtcGxhdGVEb21EYXRhKGVsZW1lbnQsIHtjb250YWluZXJEYXRhOiB2YWx1ZVRvV3JpdGV9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyAtLS0tIGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZSAtLS0tLVxuICAgIC8vIEFub255bW91cyB0ZW1wbGF0ZXMgYXJlIG5vcm1hbGx5IHNhdmVkL3JldHJpZXZlZCBhcyBET00gbm9kZXMgdGhyb3VnaCBcIm5vZGVzXCIuXG4gICAgLy8gRm9yIGNvbXBhdGliaWxpdHksIHlvdSBjYW4gYWxzbyByZWFkIFwidGV4dFwiOyBpdCB3aWxsIGJlIHNlcmlhbGl6ZWQgZnJvbSB0aGUgbm9kZXMgb24gZGVtYW5kLlxuICAgIC8vIFdyaXRpbmcgdG8gXCJ0ZXh0XCIgaXMgc3RpbGwgc3VwcG9ydGVkLCBidXQgdGhlbiB0aGUgdGVtcGxhdGUgZGF0YSB3aWxsIG5vdCBiZSBhdmFpbGFibGUgYXMgRE9NIG5vZGVzLlxuXG4gICAga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB0aGlzLmRvbUVsZW1lbnQgPSBlbGVtZW50O1xuICAgIH1cbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUucHJvdG90eXBlID0gbmV3IGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50KCk7XG4gICAga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZTtcbiAgICBrby50ZW1wbGF0ZVNvdXJjZXMuYW5vbnltb3VzVGVtcGxhdGUucHJvdG90eXBlWyd0ZXh0J10gPSBmdW5jdGlvbigvKiB2YWx1ZVRvV3JpdGUgKi8pIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlRGF0YSA9IGdldFRlbXBsYXRlRG9tRGF0YSh0aGlzLmRvbUVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKHRlbXBsYXRlRGF0YS50ZXh0RGF0YSA9PT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlRGF0YS5jb250YWluZXJEYXRhKVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRGF0YS50ZXh0RGF0YSA9IHRlbXBsYXRlRGF0YS5jb250YWluZXJEYXRhLmlubmVySFRNTDtcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZURhdGEudGV4dERhdGE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdmFsdWVUb1dyaXRlID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgc2V0VGVtcGxhdGVEb21EYXRhKHRoaXMuZG9tRWxlbWVudCwge3RleHREYXRhOiB2YWx1ZVRvV3JpdGV9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBrby5leHBvcnRTeW1ib2woJ3RlbXBsYXRlU291cmNlcycsIGtvLnRlbXBsYXRlU291cmNlcyk7XG4gICAga28uZXhwb3J0U3ltYm9sKCd0ZW1wbGF0ZVNvdXJjZXMuZG9tRWxlbWVudCcsIGtvLnRlbXBsYXRlU291cmNlcy5kb21FbGVtZW50KTtcbiAgICBrby5leHBvcnRTeW1ib2woJ3RlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZScsIGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX3RlbXBsYXRlRW5naW5lO1xuICAgIGtvLnNldFRlbXBsYXRlRW5naW5lID0gZnVuY3Rpb24gKHRlbXBsYXRlRW5naW5lKSB7XG4gICAgICAgIGlmICgodGVtcGxhdGVFbmdpbmUgIT0gdW5kZWZpbmVkKSAmJiAhKHRlbXBsYXRlRW5naW5lIGluc3RhbmNlb2Yga28udGVtcGxhdGVFbmdpbmUpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidGVtcGxhdGVFbmdpbmUgbXVzdCBpbmhlcml0IGZyb20ga28udGVtcGxhdGVFbmdpbmVcIik7XG4gICAgICAgIF90ZW1wbGF0ZUVuZ2luZSA9IHRlbXBsYXRlRW5naW5lO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGludm9rZUZvckVhY2hOb2RlSW5Db250aW51b3VzUmFuZ2UoZmlyc3ROb2RlLCBsYXN0Tm9kZSwgYWN0aW9uKSB7XG4gICAgICAgIHZhciBub2RlLCBuZXh0SW5RdWV1ZSA9IGZpcnN0Tm9kZSwgZmlyc3RPdXRPZlJhbmdlTm9kZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5uZXh0U2libGluZyhsYXN0Tm9kZSk7XG4gICAgICAgIHdoaWxlIChuZXh0SW5RdWV1ZSAmJiAoKG5vZGUgPSBuZXh0SW5RdWV1ZSkgIT09IGZpcnN0T3V0T2ZSYW5nZU5vZGUpKSB7XG4gICAgICAgICAgICBuZXh0SW5RdWV1ZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5uZXh0U2libGluZyhub2RlKTtcbiAgICAgICAgICAgIGFjdGlvbihub2RlLCBuZXh0SW5RdWV1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZUJpbmRpbmdzT25Db250aW51b3VzTm9kZUFycmF5KGNvbnRpbnVvdXNOb2RlQXJyYXksIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgICAgIC8vIFRvIGJlIHVzZWQgb24gYW55IG5vZGVzIHRoYXQgaGF2ZSBiZWVuIHJlbmRlcmVkIGJ5IGEgdGVtcGxhdGUgYW5kIGhhdmUgYmVlbiBpbnNlcnRlZCBpbnRvIHNvbWUgcGFyZW50IGVsZW1lbnRcbiAgICAgICAgLy8gV2Fsa3MgdGhyb3VnaCBjb250aW51b3VzTm9kZUFycmF5ICh3aGljaCAqbXVzdCogYmUgY29udGludW91cywgaS5lLiwgYW4gdW5pbnRlcnJ1cHRlZCBzZXF1ZW5jZSBvZiBzaWJsaW5nIG5vZGVzLCBiZWNhdXNlXG4gICAgICAgIC8vIHRoZSBhbGdvcml0aG0gZm9yIHdhbGtpbmcgdGhlbSByZWxpZXMgb24gdGhpcyksIGFuZCBmb3IgZWFjaCB0b3AtbGV2ZWwgaXRlbSBpbiB0aGUgdmlydHVhbC1lbGVtZW50IHNlbnNlLFxuICAgICAgICAvLyAoMSkgRG9lcyBhIHJlZ3VsYXIgXCJhcHBseUJpbmRpbmdzXCIgdG8gYXNzb2NpYXRlIGJpbmRpbmdDb250ZXh0IHdpdGggdGhpcyBub2RlIGFuZCB0byBhY3RpdmF0ZSBhbnkgbm9uLW1lbW9pemVkIGJpbmRpbmdzXG4gICAgICAgIC8vICgyKSBVbm1lbW9pemVzIGFueSBtZW1vcyBpbiB0aGUgRE9NIHN1YnRyZWUgKGUuZy4sIHRvIGFjdGl2YXRlIGJpbmRpbmdzIHRoYXQgaGFkIGJlZW4gbWVtb2l6ZWQgZHVyaW5nIHRlbXBsYXRlIHJld3JpdGluZylcblxuICAgICAgICBpZiAoY29udGludW91c05vZGVBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBmaXJzdE5vZGUgPSBjb250aW51b3VzTm9kZUFycmF5WzBdLFxuICAgICAgICAgICAgICAgIGxhc3ROb2RlID0gY29udGludW91c05vZGVBcnJheVtjb250aW51b3VzTm9kZUFycmF5Lmxlbmd0aCAtIDFdLFxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBmaXJzdE5vZGUucGFyZW50Tm9kZSxcbiAgICAgICAgICAgICAgICBwcm92aWRlciA9IGtvLmJpbmRpbmdQcm92aWRlclsnaW5zdGFuY2UnXSxcbiAgICAgICAgICAgICAgICBwcmVwcm9jZXNzTm9kZSA9IHByb3ZpZGVyWydwcmVwcm9jZXNzTm9kZSddO1xuXG4gICAgICAgICAgICBpZiAocHJlcHJvY2Vzc05vZGUpIHtcbiAgICAgICAgICAgICAgICBpbnZva2VGb3JFYWNoTm9kZUluQ29udGludW91c1JhbmdlKGZpcnN0Tm9kZSwgbGFzdE5vZGUsIGZ1bmN0aW9uKG5vZGUsIG5leHROb2RlSW5SYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZVByZXZpb3VzU2libGluZyA9IG5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZXMgPSBwcmVwcm9jZXNzTm9kZS5jYWxsKHByb3ZpZGVyLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld05vZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZSA9PT0gZmlyc3ROb2RlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0Tm9kZSA9IG5ld05vZGVzWzBdIHx8IG5leHROb2RlSW5SYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlID09PSBsYXN0Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0Tm9kZSA9IG5ld05vZGVzW25ld05vZGVzLmxlbmd0aCAtIDFdIHx8IG5vZGVQcmV2aW91c1NpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2UgcHJlcHJvY2Vzc05vZGUgY2FuIGNoYW5nZSB0aGUgbm9kZXMsIGluY2x1ZGluZyB0aGUgZmlyc3QgYW5kIGxhc3Qgbm9kZXMsIHVwZGF0ZSBjb250aW51b3VzTm9kZUFycmF5IHRvIG1hdGNoLlxuICAgICAgICAgICAgICAgIC8vIFdlIG5lZWQgdGhlIGZ1bGwgc2V0LCBpbmNsdWRpbmcgaW5uZXIgbm9kZXMsIGJlY2F1c2UgdGhlIHVubWVtb2l6ZSBzdGVwIG1pZ2h0IHJlbW92ZSB0aGUgZmlyc3Qgbm9kZSAoYW5kIHNvIHRoZSByZWFsXG4gICAgICAgICAgICAgICAgLy8gZmlyc3Qgbm9kZSBuZWVkcyB0byBiZSBpbiB0aGUgYXJyYXkpLlxuICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBpZiAoIWZpcnN0Tm9kZSkgeyAvLyBwcmVwcm9jZXNzTm9kZSBtaWdodCBoYXZlIHJlbW92ZWQgYWxsIHRoZSBub2RlcywgaW4gd2hpY2ggY2FzZSB0aGVyZSdzIG5vdGhpbmcgbGVmdCB0byBkb1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmaXJzdE5vZGUgPT09IGxhc3ROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkucHVzaChmaXJzdE5vZGUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXNOb2RlQXJyYXkucHVzaChmaXJzdE5vZGUsIGxhc3ROb2RlKTtcbiAgICAgICAgICAgICAgICAgICAga28udXRpbHMuZml4VXBDb250aW51b3VzTm9kZUFycmF5KGNvbnRpbnVvdXNOb2RlQXJyYXksIHBhcmVudE5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTmVlZCB0byBhcHBseUJpbmRpbmdzICpiZWZvcmUqIHVubWVtb3ppYXRpb24sIGJlY2F1c2UgdW5tZW1vaXphdGlvbiBtaWdodCBpbnRyb2R1Y2UgZXh0cmEgbm9kZXMgKHRoYXQgd2UgZG9uJ3Qgd2FudCB0byByZS1iaW5kKVxuICAgICAgICAgICAgLy8gd2hlcmVhcyBhIHJlZ3VsYXIgYXBwbHlCaW5kaW5ncyB3b24ndCBpbnRyb2R1Y2UgbmV3IG1lbW9pemVkIG5vZGVzXG4gICAgICAgICAgICBpbnZva2VGb3JFYWNoTm9kZUluQ29udGludW91c1JhbmdlKGZpcnN0Tm9kZSwgbGFzdE5vZGUsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSB8fCBub2RlLm5vZGVUeXBlID09PSA4KVxuICAgICAgICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKGJpbmRpbmdDb250ZXh0LCBub2RlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaW52b2tlRm9yRWFjaE5vZGVJbkNvbnRpbnVvdXNSYW5nZShmaXJzdE5vZGUsIGxhc3ROb2RlLCBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEgfHwgbm9kZS5ub2RlVHlwZSA9PT0gOClcbiAgICAgICAgICAgICAgICAgICAga28ubWVtb2l6YXRpb24udW5tZW1vaXplRG9tTm9kZUFuZERlc2NlbmRhbnRzKG5vZGUsIFtiaW5kaW5nQ29udGV4dF0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBhbnkgY2hhbmdlcyBkb25lIGJ5IGFwcGx5QmluZGluZ3Mgb3IgdW5tZW1vaXplIGFyZSByZWZsZWN0ZWQgaW4gdGhlIGFycmF5XG4gICAgICAgICAgICBrby51dGlscy5maXhVcENvbnRpbnVvdXNOb2RlQXJyYXkoY29udGludW91c05vZGVBcnJheSwgcGFyZW50Tm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRGaXJzdE5vZGVGcm9tUG9zc2libGVBcnJheShub2RlT3JOb2RlQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIG5vZGVPck5vZGVBcnJheS5ub2RlVHlwZSA/IG5vZGVPck5vZGVBcnJheVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbm9kZU9yTm9kZUFycmF5Lmxlbmd0aCA+IDAgPyBub2RlT3JOb2RlQXJyYXlbMF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhlY3V0ZVRlbXBsYXRlKHRhcmdldE5vZGVPck5vZGVBcnJheSwgcmVuZGVyTW9kZSwgdGVtcGxhdGUsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICB2YXIgZmlyc3RUYXJnZXROb2RlID0gdGFyZ2V0Tm9kZU9yTm9kZUFycmF5ICYmIGdldEZpcnN0Tm9kZUZyb21Qb3NzaWJsZUFycmF5KHRhcmdldE5vZGVPck5vZGVBcnJheSk7XG4gICAgICAgIHZhciB0ZW1wbGF0ZURvY3VtZW50ID0gKGZpcnN0VGFyZ2V0Tm9kZSB8fCB0ZW1wbGF0ZSB8fCB7fSkub3duZXJEb2N1bWVudDtcbiAgICAgICAgdmFyIHRlbXBsYXRlRW5naW5lVG9Vc2UgPSAob3B0aW9uc1sndGVtcGxhdGVFbmdpbmUnXSB8fCBfdGVtcGxhdGVFbmdpbmUpO1xuICAgICAgICBrby50ZW1wbGF0ZVJld3JpdGluZy5lbnN1cmVUZW1wbGF0ZUlzUmV3cml0dGVuKHRlbXBsYXRlLCB0ZW1wbGF0ZUVuZ2luZVRvVXNlLCB0ZW1wbGF0ZURvY3VtZW50KTtcbiAgICAgICAgdmFyIHJlbmRlcmVkTm9kZXNBcnJheSA9IHRlbXBsYXRlRW5naW5lVG9Vc2VbJ3JlbmRlclRlbXBsYXRlJ10odGVtcGxhdGUsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zLCB0ZW1wbGF0ZURvY3VtZW50KTtcblxuICAgICAgICAvLyBMb29zZWx5IGNoZWNrIHJlc3VsdCBpcyBhbiBhcnJheSBvZiBET00gbm9kZXNcbiAgICAgICAgaWYgKCh0eXBlb2YgcmVuZGVyZWROb2Rlc0FycmF5Lmxlbmd0aCAhPSBcIm51bWJlclwiKSB8fCAocmVuZGVyZWROb2Rlc0FycmF5Lmxlbmd0aCA+IDAgJiYgdHlwZW9mIHJlbmRlcmVkTm9kZXNBcnJheVswXS5ub2RlVHlwZSAhPSBcIm51bWJlclwiKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRlbXBsYXRlIGVuZ2luZSBtdXN0IHJldHVybiBhbiBhcnJheSBvZiBET00gbm9kZXNcIik7XG5cbiAgICAgICAgdmFyIGhhdmVBZGRlZE5vZGVzVG9QYXJlbnQgPSBmYWxzZTtcbiAgICAgICAgc3dpdGNoIChyZW5kZXJNb2RlKSB7XG4gICAgICAgICAgICBjYXNlIFwicmVwbGFjZUNoaWxkcmVuXCI6XG4gICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLnNldERvbU5vZGVDaGlsZHJlbih0YXJnZXROb2RlT3JOb2RlQXJyYXksIHJlbmRlcmVkTm9kZXNBcnJheSk7XG4gICAgICAgICAgICAgICAgaGF2ZUFkZGVkTm9kZXNUb1BhcmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwicmVwbGFjZU5vZGVcIjpcbiAgICAgICAgICAgICAgICBrby51dGlscy5yZXBsYWNlRG9tTm9kZXModGFyZ2V0Tm9kZU9yTm9kZUFycmF5LCByZW5kZXJlZE5vZGVzQXJyYXkpO1xuICAgICAgICAgICAgICAgIGhhdmVBZGRlZE5vZGVzVG9QYXJlbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImlnbm9yZVRhcmdldE5vZGVcIjogYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gcmVuZGVyTW9kZTogXCIgKyByZW5kZXJNb2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXZlQWRkZWROb2Rlc1RvUGFyZW50KSB7XG4gICAgICAgICAgICBhY3RpdmF0ZUJpbmRpbmdzT25Db250aW51b3VzTm9kZUFycmF5KHJlbmRlcmVkTm9kZXNBcnJheSwgYmluZGluZ0NvbnRleHQpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnNbJ2FmdGVyUmVuZGVyJ10pXG4gICAgICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUob3B0aW9uc1snYWZ0ZXJSZW5kZXInXSwgbnVsbCwgW3JlbmRlcmVkTm9kZXNBcnJheSwgYmluZGluZ0NvbnRleHRbJyRkYXRhJ11dKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZW5kZXJlZE5vZGVzQXJyYXk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVRlbXBsYXRlTmFtZSh0ZW1wbGF0ZSwgZGF0YSwgY29udGV4dCkge1xuICAgICAgICAvLyBUaGUgdGVtcGxhdGUgY2FuIGJlIHNwZWNpZmllZCBhczpcbiAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZSh0ZW1wbGF0ZSkpIHtcbiAgICAgICAgICAgIC8vIDEuIEFuIG9ic2VydmFibGUsIHdpdGggc3RyaW5nIHZhbHVlXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIDIuIEEgZnVuY3Rpb24gb2YgKGRhdGEsIGNvbnRleHQpIHJldHVybmluZyBhIHN0cmluZ1xuICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlKGRhdGEsIGNvbnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gMy4gQSBzdHJpbmdcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGtvLnJlbmRlclRlbXBsYXRlID0gZnVuY3Rpb24gKHRlbXBsYXRlLCBkYXRhT3JCaW5kaW5nQ29udGV4dCwgb3B0aW9ucywgdGFyZ2V0Tm9kZU9yTm9kZUFycmF5LCByZW5kZXJNb2RlKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICBpZiAoKG9wdGlvbnNbJ3RlbXBsYXRlRW5naW5lJ10gfHwgX3RlbXBsYXRlRW5naW5lKSA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTZXQgYSB0ZW1wbGF0ZSBlbmdpbmUgYmVmb3JlIGNhbGxpbmcgcmVuZGVyVGVtcGxhdGVcIik7XG4gICAgICAgIHJlbmRlck1vZGUgPSByZW5kZXJNb2RlIHx8IFwicmVwbGFjZUNoaWxkcmVuXCI7XG5cbiAgICAgICAgaWYgKHRhcmdldE5vZGVPck5vZGVBcnJheSkge1xuICAgICAgICAgICAgdmFyIGZpcnN0VGFyZ2V0Tm9kZSA9IGdldEZpcnN0Tm9kZUZyb21Qb3NzaWJsZUFycmF5KHRhcmdldE5vZGVPck5vZGVBcnJheSk7XG5cbiAgICAgICAgICAgIHZhciB3aGVuVG9EaXNwb3NlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gKCFmaXJzdFRhcmdldE5vZGUpIHx8ICFrby51dGlscy5kb21Ob2RlSXNBdHRhY2hlZFRvRG9jdW1lbnQoZmlyc3RUYXJnZXROb2RlKTsgfTsgLy8gUGFzc2l2ZSBkaXNwb3NhbCAob24gbmV4dCBldmFsdWF0aW9uKVxuICAgICAgICAgICAgdmFyIGFjdGl2ZWx5RGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkID0gKGZpcnN0VGFyZ2V0Tm9kZSAmJiByZW5kZXJNb2RlID09IFwicmVwbGFjZU5vZGVcIikgPyBmaXJzdFRhcmdldE5vZGUucGFyZW50Tm9kZSA6IGZpcnN0VGFyZ2V0Tm9kZTtcblxuICAgICAgICAgICAgcmV0dXJuIGtvLmRlcGVuZGVudE9ic2VydmFibGUoIC8vIFNvIHRoZSBET00gaXMgYXV0b21hdGljYWxseSB1cGRhdGVkIHdoZW4gYW55IGRlcGVuZGVuY3kgY2hhbmdlc1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRW5zdXJlIHdlJ3ZlIGdvdCBhIHByb3BlciBiaW5kaW5nIGNvbnRleHQgdG8gd29yayB3aXRoXG4gICAgICAgICAgICAgICAgICAgIHZhciBiaW5kaW5nQ29udGV4dCA9IChkYXRhT3JCaW5kaW5nQ29udGV4dCAmJiAoZGF0YU9yQmluZGluZ0NvbnRleHQgaW5zdGFuY2VvZiBrby5iaW5kaW5nQ29udGV4dCkpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGRhdGFPckJpbmRpbmdDb250ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICA6IG5ldyBrby5iaW5kaW5nQ29udGV4dChkYXRhT3JCaW5kaW5nQ29udGV4dCwgbnVsbCwgbnVsbCwgbnVsbCwgeyBcImV4cG9ydERlcGVuZGVuY2llc1wiOiB0cnVlIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZU5hbWUgPSByZXNvbHZlVGVtcGxhdGVOYW1lKHRlbXBsYXRlLCBiaW5kaW5nQ29udGV4dFsnJGRhdGEnXSwgYmluZGluZ0NvbnRleHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyZWROb2Rlc0FycmF5ID0gZXhlY3V0ZVRlbXBsYXRlKHRhcmdldE5vZGVPck5vZGVBcnJheSwgcmVuZGVyTW9kZSwgdGVtcGxhdGVOYW1lLCBiaW5kaW5nQ29udGV4dCwgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlck1vZGUgPT0gXCJyZXBsYWNlTm9kZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXROb2RlT3JOb2RlQXJyYXkgPSByZW5kZXJlZE5vZGVzQXJyYXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFRhcmdldE5vZGUgPSBnZXRGaXJzdE5vZGVGcm9tUG9zc2libGVBcnJheSh0YXJnZXROb2RlT3JOb2RlQXJyYXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIHsgZGlzcG9zZVdoZW46IHdoZW5Ub0Rpc3Bvc2UsIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogYWN0aXZlbHlEaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFdlIGRvbid0IHlldCBoYXZlIGEgRE9NIG5vZGUgdG8gZXZhbHVhdGUsIHNvIHVzZSBhIG1lbW8gYW5kIHJlbmRlciB0aGUgdGVtcGxhdGUgbGF0ZXIgd2hlbiB0aGVyZSBpcyBhIERPTSBub2RlXG4gICAgICAgICAgICByZXR1cm4ga28ubWVtb2l6YXRpb24ubWVtb2l6ZShmdW5jdGlvbiAoZG9tTm9kZSkge1xuICAgICAgICAgICAgICAgIGtvLnJlbmRlclRlbXBsYXRlKHRlbXBsYXRlLCBkYXRhT3JCaW5kaW5nQ29udGV4dCwgb3B0aW9ucywgZG9tTm9kZSwgXCJyZXBsYWNlTm9kZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGtvLnJlbmRlclRlbXBsYXRlRm9yRWFjaCA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgYXJyYXlPck9ic2VydmFibGVBcnJheSwgb3B0aW9ucywgdGFyZ2V0Tm9kZSwgcGFyZW50QmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgLy8gU2luY2Ugc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZyBhbHdheXMgY2FsbHMgZXhlY3V0ZVRlbXBsYXRlRm9yQXJyYXlJdGVtIGFuZCB0aGVuXG4gICAgICAgIC8vIGFjdGl2YXRlQmluZGluZ3NDYWxsYmFjayBmb3IgYWRkZWQgaXRlbXMsIHdlIGNhbiBzdG9yZSB0aGUgYmluZGluZyBjb250ZXh0IGluIHRoZSBmb3JtZXIgdG8gdXNlIGluIHRoZSBsYXR0ZXIuXG4gICAgICAgIHZhciBhcnJheUl0ZW1Db250ZXh0O1xuXG4gICAgICAgIC8vIFRoaXMgd2lsbCBiZSBjYWxsZWQgYnkgc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZyB0byBnZXQgdGhlIG5vZGVzIHRvIGFkZCB0byB0YXJnZXROb2RlXG4gICAgICAgIHZhciBleGVjdXRlVGVtcGxhdGVGb3JBcnJheUl0ZW0gPSBmdW5jdGlvbiAoYXJyYXlWYWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgICAgIC8vIFN1cHBvcnQgc2VsZWN0aW5nIHRlbXBsYXRlIGFzIGEgZnVuY3Rpb24gb2YgdGhlIGRhdGEgYmVpbmcgcmVuZGVyZWRcbiAgICAgICAgICAgIGFycmF5SXRlbUNvbnRleHQgPSBwYXJlbnRCaW5kaW5nQ29udGV4dFsnY3JlYXRlQ2hpbGRDb250ZXh0J10oYXJyYXlWYWx1ZSwgb3B0aW9uc1snYXMnXSwgZnVuY3Rpb24oY29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRbJyRpbmRleCddID0gaW5kZXg7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlTmFtZSA9IHJlc29sdmVUZW1wbGF0ZU5hbWUodGVtcGxhdGUsIGFycmF5VmFsdWUsIGFycmF5SXRlbUNvbnRleHQpO1xuICAgICAgICAgICAgcmV0dXJuIGV4ZWN1dGVUZW1wbGF0ZShudWxsLCBcImlnbm9yZVRhcmdldE5vZGVcIiwgdGVtcGxhdGVOYW1lLCBhcnJheUl0ZW1Db250ZXh0LCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXIgc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZyBoYXMgYWRkZWQgbm9kZXMgdG8gdGFyZ2V0Tm9kZVxuICAgICAgICB2YXIgYWN0aXZhdGVCaW5kaW5nc0NhbGxiYWNrID0gZnVuY3Rpb24oYXJyYXlWYWx1ZSwgYWRkZWROb2Rlc0FycmF5LCBpbmRleCkge1xuICAgICAgICAgICAgYWN0aXZhdGVCaW5kaW5nc09uQ29udGludW91c05vZGVBcnJheShhZGRlZE5vZGVzQXJyYXksIGFycmF5SXRlbUNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnNbJ2FmdGVyUmVuZGVyJ10pXG4gICAgICAgICAgICAgICAgb3B0aW9uc1snYWZ0ZXJSZW5kZXInXShhZGRlZE5vZGVzQXJyYXksIGFycmF5VmFsdWUpO1xuXG4gICAgICAgICAgICAvLyByZWxlYXNlIHRoZSBcImNhY2hlXCIgdmFyaWFibGUsIHNvIHRoYXQgaXQgY2FuIGJlIGNvbGxlY3RlZCBieVxuICAgICAgICAgICAgLy8gdGhlIEdDIHdoZW4gaXRzIHZhbHVlIGlzbid0IHVzZWQgZnJvbSB3aXRoaW4gdGhlIGJpbmRpbmdzIGFueW1vcmUuXG4gICAgICAgICAgICBhcnJheUl0ZW1Db250ZXh0ID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ga28uZGVwZW5kZW50T2JzZXJ2YWJsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdW53cmFwcGVkQXJyYXkgPSBrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGFycmF5T3JPYnNlcnZhYmxlQXJyYXkpIHx8IFtdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1bndyYXBwZWRBcnJheS5sZW5ndGggPT0gXCJ1bmRlZmluZWRcIikgLy8gQ29lcmNlIHNpbmdsZSB2YWx1ZSBpbnRvIGFycmF5XG4gICAgICAgICAgICAgICAgdW53cmFwcGVkQXJyYXkgPSBbdW53cmFwcGVkQXJyYXldO1xuXG4gICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IGFueSBlbnRyaWVzIG1hcmtlZCBhcyBkZXN0cm95ZWRcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZEFycmF5ID0ga28udXRpbHMuYXJyYXlGaWx0ZXIodW53cmFwcGVkQXJyYXksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3B0aW9uc1snaW5jbHVkZURlc3Ryb3llZCddIHx8IGl0ZW0gPT09IHVuZGVmaW5lZCB8fCBpdGVtID09PSBudWxsIHx8ICFrby51dGlscy51bndyYXBPYnNlcnZhYmxlKGl0ZW1bJ19kZXN0cm95J10pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZywgaWdub3JpbmcgYW55IG9ic2VydmFibGVzIHVud3JhcHBlZCB3aXRoaW4gKG1vc3QgbGlrZWx5IGZyb20gYSBjYWxsYmFjayBmdW5jdGlvbikuXG4gICAgICAgICAgICAvLyBJZiB0aGUgYXJyYXkgaXRlbXMgYXJlIG9ic2VydmFibGVzLCB0aG91Z2gsIHRoZXkgd2lsbCBiZSB1bndyYXBwZWQgaW4gZXhlY3V0ZVRlbXBsYXRlRm9yQXJyYXlJdGVtIGFuZCBtYW5hZ2VkIHdpdGhpbiBzZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nLlxuICAgICAgICAgICAga28uZGVwZW5kZW5jeURldGVjdGlvbi5pZ25vcmUoa28udXRpbHMuc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZywgbnVsbCwgW3RhcmdldE5vZGUsIGZpbHRlcmVkQXJyYXksIGV4ZWN1dGVUZW1wbGF0ZUZvckFycmF5SXRlbSwgb3B0aW9ucywgYWN0aXZhdGVCaW5kaW5nc0NhbGxiYWNrXSk7XG5cbiAgICAgICAgfSwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IHRhcmdldE5vZGUgfSk7XG4gICAgfTtcblxuICAgIHZhciB0ZW1wbGF0ZUNvbXB1dGVkRG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpO1xuICAgIGZ1bmN0aW9uIGRpc3Bvc2VPbGRDb21wdXRlZEFuZFN0b3JlTmV3T25lKGVsZW1lbnQsIG5ld0NvbXB1dGVkKSB7XG4gICAgICAgIHZhciBvbGRDb21wdXRlZCA9IGtvLnV0aWxzLmRvbURhdGEuZ2V0KGVsZW1lbnQsIHRlbXBsYXRlQ29tcHV0ZWREb21EYXRhS2V5KTtcbiAgICAgICAgaWYgKG9sZENvbXB1dGVkICYmICh0eXBlb2Yob2xkQ29tcHV0ZWQuZGlzcG9zZSkgPT0gJ2Z1bmN0aW9uJykpXG4gICAgICAgICAgICBvbGRDb21wdXRlZC5kaXNwb3NlKCk7XG4gICAgICAgIGtvLnV0aWxzLmRvbURhdGEuc2V0KGVsZW1lbnQsIHRlbXBsYXRlQ29tcHV0ZWREb21EYXRhS2V5LCAobmV3Q29tcHV0ZWQgJiYgbmV3Q29tcHV0ZWQuaXNBY3RpdmUoKSkgPyBuZXdDb21wdXRlZCA6IHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAga28uYmluZGluZ0hhbmRsZXJzWyd0ZW1wbGF0ZSddID0ge1xuICAgICAgICAnaW5pdCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IpIHtcbiAgICAgICAgICAgIC8vIFN1cHBvcnQgYW5vbnltb3VzIHRlbXBsYXRlc1xuICAgICAgICAgICAgdmFyIGJpbmRpbmdWYWx1ZSA9IGtvLnV0aWxzLnVud3JhcE9ic2VydmFibGUodmFsdWVBY2Nlc3NvcigpKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYmluZGluZ1ZhbHVlID09IFwic3RyaW5nXCIgfHwgYmluZGluZ1ZhbHVlWyduYW1lJ10pIHtcbiAgICAgICAgICAgICAgICAvLyBJdCdzIGEgbmFtZWQgdGVtcGxhdGUgLSBjbGVhciB0aGUgZWxlbWVudFxuICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5lbXB0eU5vZGUoZWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCdub2RlcycgaW4gYmluZGluZ1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UndmUgYmVlbiBnaXZlbiBhbiBhcnJheSBvZiBET00gbm9kZXMuIFNhdmUgdGhlbSBhcyB0aGUgdGVtcGxhdGUgc291cmNlLlxuICAgICAgICAgICAgICAgIC8vIFRoZXJlIGlzIG5vIGtub3duIHVzZSBjYXNlIGZvciB0aGUgbm9kZSBhcnJheSBiZWluZyBhbiBvYnNlcnZhYmxlIGFycmF5IChpZiB0aGUgb3V0cHV0XG4gICAgICAgICAgICAgICAgLy8gdmFyaWVzLCBwdXQgdGhhdCBiZWhhdmlvciAqaW50byogeW91ciB0ZW1wbGF0ZSAtIHRoYXQncyB3aGF0IHRlbXBsYXRlcyBhcmUgZm9yKSwgYW5kXG4gICAgICAgICAgICAgICAgLy8gdGhlIGltcGxlbWVudGF0aW9uIHdvdWxkIGJlIGEgbWVzcywgc28gYXNzZXJ0IHRoYXQgaXQncyBub3Qgb2JzZXJ2YWJsZS5cbiAgICAgICAgICAgICAgICB2YXIgbm9kZXMgPSBiaW5kaW5nVmFsdWVbJ25vZGVzJ10gfHwgW107XG4gICAgICAgICAgICAgICAgaWYgKGtvLmlzT2JzZXJ2YWJsZShub2RlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJub2Rlc1wiIG9wdGlvbiBtdXN0IGJlIGEgcGxhaW4sIG5vbi1vYnNlcnZhYmxlIGFycmF5LicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0ga28udXRpbHMubW92ZUNsZWFuZWROb2Rlc1RvQ29udGFpbmVyRWxlbWVudChub2Rlcyk7IC8vIFRoaXMgYWxzbyByZW1vdmVzIHRoZSBub2RlcyBmcm9tIHRoZWlyIGN1cnJlbnQgcGFyZW50XG4gICAgICAgICAgICAgICAgbmV3IGtvLnRlbXBsYXRlU291cmNlcy5hbm9ueW1vdXNUZW1wbGF0ZShlbGVtZW50KVsnbm9kZXMnXShjb250YWluZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJdCdzIGFuIGFub255bW91cyB0ZW1wbGF0ZSAtIHN0b3JlIHRoZSBlbGVtZW50IGNvbnRlbnRzLCB0aGVuIGNsZWFyIHRoZSBlbGVtZW50XG4gICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlTm9kZXMgPSBrby52aXJ0dWFsRWxlbWVudHMuY2hpbGROb2RlcyhlbGVtZW50KSxcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyID0ga28udXRpbHMubW92ZUNsZWFuZWROb2Rlc1RvQ29udGFpbmVyRWxlbWVudCh0ZW1wbGF0ZU5vZGVzKTsgLy8gVGhpcyBhbHNvIHJlbW92ZXMgdGhlIG5vZGVzIGZyb20gdGhlaXIgY3VycmVudCBwYXJlbnRcbiAgICAgICAgICAgICAgICBuZXcga28udGVtcGxhdGVTb3VyY2VzLmFub255bW91c1RlbXBsYXRlKGVsZW1lbnQpWydub2RlcyddKGNvbnRhaW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyAnY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MnOiB0cnVlIH07XG4gICAgICAgIH0sXG4gICAgICAgICd1cGRhdGUnOiBmdW5jdGlvbiAoZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlQWNjZXNzb3IoKSxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZSh2YWx1ZSksXG4gICAgICAgICAgICAgICAgc2hvdWxkRGlzcGxheSA9IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVDb21wdXRlZCA9IG51bGwsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVOYW1lO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlTmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVOYW1lID0gb3B0aW9uc1snbmFtZSddO1xuXG4gICAgICAgICAgICAgICAgLy8gU3VwcG9ydCBcImlmXCIvXCJpZm5vdFwiIGNvbmRpdGlvbnNcbiAgICAgICAgICAgICAgICBpZiAoJ2lmJyBpbiBvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICBzaG91bGREaXNwbGF5ID0ga28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShvcHRpb25zWydpZiddKTtcbiAgICAgICAgICAgICAgICBpZiAoc2hvdWxkRGlzcGxheSAmJiAnaWZub3QnIGluIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIHNob3VsZERpc3BsYXkgPSAha28udXRpbHMudW53cmFwT2JzZXJ2YWJsZShvcHRpb25zWydpZm5vdCddKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCdmb3JlYWNoJyBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIG9uY2UgZm9yIGVhY2ggZGF0YSBwb2ludCAodHJlYXRpbmcgZGF0YSBzZXQgYXMgZW1wdHkgaWYgc2hvdWxkRGlzcGxheT09ZmFsc2UpXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFBcnJheSA9IChzaG91bGREaXNwbGF5ICYmIG9wdGlvbnNbJ2ZvcmVhY2gnXSkgfHwgW107XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVDb21wdXRlZCA9IGtvLnJlbmRlclRlbXBsYXRlRm9yRWFjaCh0ZW1wbGF0ZU5hbWUgfHwgZWxlbWVudCwgZGF0YUFycmF5LCBvcHRpb25zLCBlbGVtZW50LCBiaW5kaW5nQ29udGV4dCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzaG91bGREaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAga28udmlydHVhbEVsZW1lbnRzLmVtcHR5Tm9kZShlbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIG9uY2UgZm9yIHRoaXMgc2luZ2xlIGRhdGEgcG9pbnQgKG9yIHVzZSB0aGUgdmlld01vZGVsIGlmIG5vIGRhdGEgd2FzIHByb3ZpZGVkKVxuICAgICAgICAgICAgICAgIHZhciBpbm5lckJpbmRpbmdDb250ZXh0ID0gKCdkYXRhJyBpbiBvcHRpb25zKSA/XG4gICAgICAgICAgICAgICAgICAgIGJpbmRpbmdDb250ZXh0LmNyZWF0ZVN0YXRpY0NoaWxkQ29udGV4dChvcHRpb25zWydkYXRhJ10sIG9wdGlvbnNbJ2FzJ10pIDogIC8vIEdpdmVuIGFuIGV4cGxpdGl0ICdkYXRhJyB2YWx1ZSwgd2UgY3JlYXRlIGEgY2hpbGQgYmluZGluZyBjb250ZXh0IGZvciBpdFxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nQ29udGV4dDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdpdmVuIG5vIGV4cGxpY2l0ICdkYXRhJyB2YWx1ZSwgd2UgcmV0YWluIHRoZSBzYW1lIGJpbmRpbmcgY29udGV4dFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlQ29tcHV0ZWQgPSBrby5yZW5kZXJUZW1wbGF0ZSh0ZW1wbGF0ZU5hbWUgfHwgZWxlbWVudCwgaW5uZXJCaW5kaW5nQ29udGV4dCwgb3B0aW9ucywgZWxlbWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEl0IG9ubHkgbWFrZXMgc2Vuc2UgdG8gaGF2ZSBhIHNpbmdsZSB0ZW1wbGF0ZSBjb21wdXRlZCBwZXIgZWxlbWVudCAob3RoZXJ3aXNlIHdoaWNoIG9uZSBzaG91bGQgaGF2ZSBpdHMgb3V0cHV0IGRpc3BsYXllZD8pXG4gICAgICAgICAgICBkaXNwb3NlT2xkQ29tcHV0ZWRBbmRTdG9yZU5ld09uZShlbGVtZW50LCB0ZW1wbGF0ZUNvbXB1dGVkKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBBbm9ueW1vdXMgdGVtcGxhdGVzIGNhbid0IGJlIHJld3JpdHRlbi4gR2l2ZSBhIG5pY2UgZXJyb3IgbWVzc2FnZSBpZiB5b3UgdHJ5IHRvIGRvIGl0LlxuICAgIGtvLmV4cHJlc3Npb25SZXdyaXRpbmcuYmluZGluZ1Jld3JpdGVWYWxpZGF0b3JzWyd0ZW1wbGF0ZSddID0gZnVuY3Rpb24oYmluZGluZ1ZhbHVlKSB7XG4gICAgICAgIHZhciBwYXJzZWRCaW5kaW5nVmFsdWUgPSBrby5leHByZXNzaW9uUmV3cml0aW5nLnBhcnNlT2JqZWN0TGl0ZXJhbChiaW5kaW5nVmFsdWUpO1xuXG4gICAgICAgIGlmICgocGFyc2VkQmluZGluZ1ZhbHVlLmxlbmd0aCA9PSAxKSAmJiBwYXJzZWRCaW5kaW5nVmFsdWVbMF1bJ3Vua25vd24nXSlcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBJdCBsb29rcyBsaWtlIGEgc3RyaW5nIGxpdGVyYWwsIG5vdCBhbiBvYmplY3QgbGl0ZXJhbCwgc28gdHJlYXQgaXQgYXMgYSBuYW1lZCB0ZW1wbGF0ZSAod2hpY2ggaXMgYWxsb3dlZCBmb3IgcmV3cml0aW5nKVxuXG4gICAgICAgIGlmIChrby5leHByZXNzaW9uUmV3cml0aW5nLmtleVZhbHVlQXJyYXlDb250YWluc0tleShwYXJzZWRCaW5kaW5nVmFsdWUsIFwibmFtZVwiKSlcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBOYW1lZCB0ZW1wbGF0ZXMgY2FuIGJlIHJld3JpdHRlbiwgc28gcmV0dXJuIFwibm8gZXJyb3JcIlxuICAgICAgICByZXR1cm4gXCJUaGlzIHRlbXBsYXRlIGVuZ2luZSBkb2VzIG5vdCBzdXBwb3J0IGFub255bW91cyB0ZW1wbGF0ZXMgbmVzdGVkIHdpdGhpbiBpdHMgdGVtcGxhdGVzXCI7XG4gICAgfTtcblxuICAgIGtvLnZpcnR1YWxFbGVtZW50cy5hbGxvd2VkQmluZGluZ3NbJ3RlbXBsYXRlJ10gPSB0cnVlO1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCdzZXRUZW1wbGF0ZUVuZ2luZScsIGtvLnNldFRlbXBsYXRlRW5naW5lKTtcbmtvLmV4cG9ydFN5bWJvbCgncmVuZGVyVGVtcGxhdGUnLCBrby5yZW5kZXJUZW1wbGF0ZSk7XG4vLyBHbyB0aHJvdWdoIHRoZSBpdGVtcyB0aGF0IGhhdmUgYmVlbiBhZGRlZCBhbmQgZGVsZXRlZCBhbmQgdHJ5IHRvIGZpbmQgbWF0Y2hlcyBiZXR3ZWVuIHRoZW0uXG5rby51dGlscy5maW5kTW92ZXNJbkFycmF5Q29tcGFyaXNvbiA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCwgbGltaXRGYWlsZWRDb21wYXJlcykge1xuICAgIGlmIChsZWZ0Lmxlbmd0aCAmJiByaWdodC5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGZhaWxlZENvbXBhcmVzLCBsLCByLCBsZWZ0SXRlbSwgcmlnaHRJdGVtO1xuICAgICAgICBmb3IgKGZhaWxlZENvbXBhcmVzID0gbCA9IDA7ICghbGltaXRGYWlsZWRDb21wYXJlcyB8fCBmYWlsZWRDb21wYXJlcyA8IGxpbWl0RmFpbGVkQ29tcGFyZXMpICYmIChsZWZ0SXRlbSA9IGxlZnRbbF0pOyArK2wpIHtcbiAgICAgICAgICAgIGZvciAociA9IDA7IHJpZ2h0SXRlbSA9IHJpZ2h0W3JdOyArK3IpIHtcbiAgICAgICAgICAgICAgICBpZiAobGVmdEl0ZW1bJ3ZhbHVlJ10gPT09IHJpZ2h0SXRlbVsndmFsdWUnXSkge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0SXRlbVsnbW92ZWQnXSA9IHJpZ2h0SXRlbVsnaW5kZXgnXTtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHRJdGVtWydtb3ZlZCddID0gbGVmdEl0ZW1bJ2luZGV4J107XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0LnNwbGljZShyLCAxKTsgICAgICAgICAvLyBUaGlzIGl0ZW0gaXMgbWFya2VkIGFzIG1vdmVkOyBzbyByZW1vdmUgaXQgZnJvbSByaWdodCBsaXN0XG4gICAgICAgICAgICAgICAgICAgIGZhaWxlZENvbXBhcmVzID0gciA9IDA7ICAgICAvLyBSZXNldCBmYWlsZWQgY29tcGFyZXMgY291bnQgYmVjYXVzZSB3ZSdyZSBjaGVja2luZyBmb3IgY29uc2VjdXRpdmUgZmFpbHVyZXNcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmFpbGVkQ29tcGFyZXMgKz0gcjtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmtvLnV0aWxzLmNvbXBhcmVBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdGF0dXNOb3RJbk9sZCA9ICdhZGRlZCcsIHN0YXR1c05vdEluTmV3ID0gJ2RlbGV0ZWQnO1xuXG4gICAgLy8gU2ltcGxlIGNhbGN1bGF0aW9uIGJhc2VkIG9uIExldmVuc2h0ZWluIGRpc3RhbmNlLlxuICAgIGZ1bmN0aW9uIGNvbXBhcmVBcnJheXMob2xkQXJyYXksIG5ld0FycmF5LCBvcHRpb25zKSB7XG4gICAgICAgIC8vIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBpZiB0aGUgdGhpcmQgYXJnIGlzIGFjdHVhbGx5IGEgYm9vbCwgaW50ZXJwcmV0XG4gICAgICAgIC8vIGl0IGFzIHRoZSBvbGQgcGFyYW1ldGVyICdkb250TGltaXRNb3ZlcycuIE5ld2VyIGNvZGUgc2hvdWxkIHVzZSB7IGRvbnRMaW1pdE1vdmVzOiB0cnVlIH0uXG4gICAgICAgIG9wdGlvbnMgPSAodHlwZW9mIG9wdGlvbnMgPT09ICdib29sZWFuJykgPyB7ICdkb250TGltaXRNb3Zlcyc6IG9wdGlvbnMgfSA6IChvcHRpb25zIHx8IHt9KTtcbiAgICAgICAgb2xkQXJyYXkgPSBvbGRBcnJheSB8fCBbXTtcbiAgICAgICAgbmV3QXJyYXkgPSBuZXdBcnJheSB8fCBbXTtcblxuICAgICAgICBpZiAob2xkQXJyYXkubGVuZ3RoIDwgbmV3QXJyYXkubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmVTbWFsbEFycmF5VG9CaWdBcnJheShvbGRBcnJheSwgbmV3QXJyYXksIHN0YXR1c05vdEluT2xkLCBzdGF0dXNOb3RJbk5ldywgb3B0aW9ucyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBjb21wYXJlU21hbGxBcnJheVRvQmlnQXJyYXkobmV3QXJyYXksIG9sZEFycmF5LCBzdGF0dXNOb3RJbk5ldywgc3RhdHVzTm90SW5PbGQsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBhcmVTbWFsbEFycmF5VG9CaWdBcnJheShzbWxBcnJheSwgYmlnQXJyYXksIHN0YXR1c05vdEluU21sLCBzdGF0dXNOb3RJbkJpZywgb3B0aW9ucykge1xuICAgICAgICB2YXIgbXlNaW4gPSBNYXRoLm1pbixcbiAgICAgICAgICAgIG15TWF4ID0gTWF0aC5tYXgsXG4gICAgICAgICAgICBlZGl0RGlzdGFuY2VNYXRyaXggPSBbXSxcbiAgICAgICAgICAgIHNtbEluZGV4LCBzbWxJbmRleE1heCA9IHNtbEFycmF5Lmxlbmd0aCxcbiAgICAgICAgICAgIGJpZ0luZGV4LCBiaWdJbmRleE1heCA9IGJpZ0FycmF5Lmxlbmd0aCxcbiAgICAgICAgICAgIGNvbXBhcmVSYW5nZSA9IChiaWdJbmRleE1heCAtIHNtbEluZGV4TWF4KSB8fCAxLFxuICAgICAgICAgICAgbWF4RGlzdGFuY2UgPSBzbWxJbmRleE1heCArIGJpZ0luZGV4TWF4ICsgMSxcbiAgICAgICAgICAgIHRoaXNSb3csIGxhc3RSb3csXG4gICAgICAgICAgICBiaWdJbmRleE1heEZvclJvdywgYmlnSW5kZXhNaW5Gb3JSb3c7XG5cbiAgICAgICAgZm9yIChzbWxJbmRleCA9IDA7IHNtbEluZGV4IDw9IHNtbEluZGV4TWF4OyBzbWxJbmRleCsrKSB7XG4gICAgICAgICAgICBsYXN0Um93ID0gdGhpc1JvdztcbiAgICAgICAgICAgIGVkaXREaXN0YW5jZU1hdHJpeC5wdXNoKHRoaXNSb3cgPSBbXSk7XG4gICAgICAgICAgICBiaWdJbmRleE1heEZvclJvdyA9IG15TWluKGJpZ0luZGV4TWF4LCBzbWxJbmRleCArIGNvbXBhcmVSYW5nZSk7XG4gICAgICAgICAgICBiaWdJbmRleE1pbkZvclJvdyA9IG15TWF4KDAsIHNtbEluZGV4IC0gMSk7XG4gICAgICAgICAgICBmb3IgKGJpZ0luZGV4ID0gYmlnSW5kZXhNaW5Gb3JSb3c7IGJpZ0luZGV4IDw9IGJpZ0luZGV4TWF4Rm9yUm93OyBiaWdJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFiaWdJbmRleClcbiAgICAgICAgICAgICAgICAgICAgdGhpc1Jvd1tiaWdJbmRleF0gPSBzbWxJbmRleCArIDE7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIXNtbEluZGV4KSAgLy8gVG9wIHJvdyAtIHRyYW5zZm9ybSBlbXB0eSBhcnJheSBpbnRvIG5ldyBhcnJheSB2aWEgYWRkaXRpb25zXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3dbYmlnSW5kZXhdID0gYmlnSW5kZXggKyAxO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNtbEFycmF5W3NtbEluZGV4IC0gMV0gPT09IGJpZ0FycmF5W2JpZ0luZGV4IC0gMV0pXG4gICAgICAgICAgICAgICAgICAgIHRoaXNSb3dbYmlnSW5kZXhdID0gbGFzdFJvd1tiaWdJbmRleCAtIDFdOyAgICAgICAgICAgICAgICAgIC8vIGNvcHkgdmFsdWUgKG5vIGVkaXQpXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub3J0aERpc3RhbmNlID0gbGFzdFJvd1tiaWdJbmRleF0gfHwgbWF4RGlzdGFuY2U7ICAgICAgIC8vIG5vdCBpbiBiaWcgKGRlbGV0aW9uKVxuICAgICAgICAgICAgICAgICAgICB2YXIgd2VzdERpc3RhbmNlID0gdGhpc1Jvd1tiaWdJbmRleCAtIDFdIHx8IG1heERpc3RhbmNlOyAgICAvLyBub3QgaW4gc21hbGwgKGFkZGl0aW9uKVxuICAgICAgICAgICAgICAgICAgICB0aGlzUm93W2JpZ0luZGV4XSA9IG15TWluKG5vcnRoRGlzdGFuY2UsIHdlc3REaXN0YW5jZSkgKyAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlZGl0U2NyaXB0ID0gW10sIG1lTWludXNPbmUsIG5vdEluU21sID0gW10sIG5vdEluQmlnID0gW107XG4gICAgICAgIGZvciAoc21sSW5kZXggPSBzbWxJbmRleE1heCwgYmlnSW5kZXggPSBiaWdJbmRleE1heDsgc21sSW5kZXggfHwgYmlnSW5kZXg7KSB7XG4gICAgICAgICAgICBtZU1pbnVzT25lID0gZWRpdERpc3RhbmNlTWF0cml4W3NtbEluZGV4XVtiaWdJbmRleF0gLSAxO1xuICAgICAgICAgICAgaWYgKGJpZ0luZGV4ICYmIG1lTWludXNPbmUgPT09IGVkaXREaXN0YW5jZU1hdHJpeFtzbWxJbmRleF1bYmlnSW5kZXgtMV0pIHtcbiAgICAgICAgICAgICAgICBub3RJblNtbC5wdXNoKGVkaXRTY3JpcHRbZWRpdFNjcmlwdC5sZW5ndGhdID0geyAgICAgLy8gYWRkZWRcbiAgICAgICAgICAgICAgICAgICAgJ3N0YXR1cyc6IHN0YXR1c05vdEluU21sLFxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiBiaWdBcnJheVstLWJpZ0luZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgJ2luZGV4JzogYmlnSW5kZXggfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNtbEluZGV4ICYmIG1lTWludXNPbmUgPT09IGVkaXREaXN0YW5jZU1hdHJpeFtzbWxJbmRleCAtIDFdW2JpZ0luZGV4XSkge1xuICAgICAgICAgICAgICAgIG5vdEluQmlnLnB1c2goZWRpdFNjcmlwdFtlZGl0U2NyaXB0Lmxlbmd0aF0gPSB7ICAgICAvLyBkZWxldGVkXG4gICAgICAgICAgICAgICAgICAgICdzdGF0dXMnOiBzdGF0dXNOb3RJbkJpZyxcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogc21sQXJyYXlbLS1zbWxJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgICdpbmRleCc6IHNtbEluZGV4IH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAtLWJpZ0luZGV4O1xuICAgICAgICAgICAgICAgIC0tc21sSW5kZXg7XG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zWydzcGFyc2UnXSkge1xuICAgICAgICAgICAgICAgICAgICBlZGl0U2NyaXB0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0YXR1cyc6IFwicmV0YWluZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IGJpZ0FycmF5W2JpZ0luZGV4XSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgYSBsaW1pdCBvbiB0aGUgbnVtYmVyIG9mIGNvbnNlY3V0aXZlIG5vbi1tYXRjaGluZyBjb21wYXJpc29uczsgaGF2aW5nIGl0IGEgbXVsdGlwbGUgb2ZcbiAgICAgICAgLy8gc21sSW5kZXhNYXgga2VlcHMgdGhlIHRpbWUgY29tcGxleGl0eSBvZiB0aGlzIGFsZ29yaXRobSBsaW5lYXIuXG4gICAgICAgIGtvLnV0aWxzLmZpbmRNb3Zlc0luQXJyYXlDb21wYXJpc29uKG5vdEluQmlnLCBub3RJblNtbCwgIW9wdGlvbnNbJ2RvbnRMaW1pdE1vdmVzJ10gJiYgc21sSW5kZXhNYXggKiAxMCk7XG5cbiAgICAgICAgcmV0dXJuIGVkaXRTY3JpcHQucmV2ZXJzZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBjb21wYXJlQXJyYXlzO1xufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCd1dGlscy5jb21wYXJlQXJyYXlzJywga28udXRpbHMuY29tcGFyZUFycmF5cyk7XG4oZnVuY3Rpb24gKCkge1xuICAgIC8vIE9iamVjdGl2ZTpcbiAgICAvLyAqIEdpdmVuIGFuIGlucHV0IGFycmF5LCBhIGNvbnRhaW5lciBET00gbm9kZSwgYW5kIGEgZnVuY3Rpb24gZnJvbSBhcnJheSBlbGVtZW50cyB0byBhcnJheXMgb2YgRE9NIG5vZGVzLFxuICAgIC8vICAgbWFwIHRoZSBhcnJheSBlbGVtZW50cyB0byBhcnJheXMgb2YgRE9NIG5vZGVzLCBjb25jYXRlbmF0ZSB0b2dldGhlciBhbGwgdGhlc2UgYXJyYXlzLCBhbmQgdXNlIHRoZW0gdG8gcG9wdWxhdGUgdGhlIGNvbnRhaW5lciBET00gbm9kZVxuICAgIC8vICogTmV4dCB0aW1lIHdlJ3JlIGdpdmVuIHRoZSBzYW1lIGNvbWJpbmF0aW9uIG9mIHRoaW5ncyAod2l0aCB0aGUgYXJyYXkgcG9zc2libHkgaGF2aW5nIG11dGF0ZWQpLCB1cGRhdGUgdGhlIGNvbnRhaW5lciBET00gbm9kZVxuICAgIC8vICAgc28gdGhhdCBpdHMgY2hpbGRyZW4gaXMgYWdhaW4gdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlIG1hcHBpbmdzIG9mIHRoZSBhcnJheSBlbGVtZW50cywgYnV0IGRvbid0IHJlLW1hcCBhbnkgYXJyYXkgZWxlbWVudHMgdGhhdCB3ZVxuICAgIC8vICAgcHJldmlvdXNseSBtYXBwZWQgLSByZXRhaW4gdGhvc2Ugbm9kZXMsIGFuZCBqdXN0IGluc2VydC9kZWxldGUgb3RoZXIgb25lc1xuXG4gICAgLy8gXCJjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXNcIiB3aWxsIGJlIGludm9rZWQgYWZ0ZXIgYW55IFwibWFwcGluZ1wiLWdlbmVyYXRlZCBub2RlcyBhcmUgaW5zZXJ0ZWQgaW50byB0aGUgY29udGFpbmVyIG5vZGVcbiAgICAvLyBZb3UgY2FuIHVzZSB0aGlzLCBmb3IgZXhhbXBsZSwgdG8gYWN0aXZhdGUgYmluZGluZ3Mgb24gdGhvc2Ugbm9kZXMuXG5cbiAgICBmdW5jdGlvbiBtYXBOb2RlQW5kUmVmcmVzaFdoZW5DaGFuZ2VkKGNvbnRhaW5lck5vZGUsIG1hcHBpbmcsIHZhbHVlVG9NYXAsIGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2RlcywgaW5kZXgpIHtcbiAgICAgICAgLy8gTWFwIHRoaXMgYXJyYXkgdmFsdWUgaW5zaWRlIGEgZGVwZW5kZW50T2JzZXJ2YWJsZSBzbyB3ZSByZS1tYXAgd2hlbiBhbnkgZGVwZW5kZW5jeSBjaGFuZ2VzXG4gICAgICAgIHZhciBtYXBwZWROb2RlcyA9IFtdO1xuICAgICAgICB2YXIgZGVwZW5kZW50T2JzZXJ2YWJsZSA9IGtvLmRlcGVuZGVudE9ic2VydmFibGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbmV3TWFwcGVkTm9kZXMgPSBtYXBwaW5nKHZhbHVlVG9NYXAsIGluZGV4LCBrby51dGlscy5maXhVcENvbnRpbnVvdXNOb2RlQXJyYXkobWFwcGVkTm9kZXMsIGNvbnRhaW5lck5vZGUpKSB8fCBbXTtcblxuICAgICAgICAgICAgLy8gT24gc3Vic2VxdWVudCBldmFsdWF0aW9ucywganVzdCByZXBsYWNlIHRoZSBwcmV2aW91c2x5LWluc2VydGVkIERPTSBub2Rlc1xuICAgICAgICAgICAgaWYgKG1hcHBlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBrby51dGlscy5yZXBsYWNlRG9tTm9kZXMobWFwcGVkTm9kZXMsIG5ld01hcHBlZE5vZGVzKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2tBZnRlckFkZGluZ05vZGVzKVxuICAgICAgICAgICAgICAgICAgICBrby5kZXBlbmRlbmN5RGV0ZWN0aW9uLmlnbm9yZShjYWxsYmFja0FmdGVyQWRkaW5nTm9kZXMsIG51bGwsIFt2YWx1ZVRvTWFwLCBuZXdNYXBwZWROb2RlcywgaW5kZXhdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgY29udGVudHMgb2YgdGhlIG1hcHBlZE5vZGVzIGFycmF5LCB0aGVyZWJ5IHVwZGF0aW5nIHRoZSByZWNvcmRcbiAgICAgICAgICAgIC8vIG9mIHdoaWNoIG5vZGVzIHdvdWxkIGJlIGRlbGV0ZWQgaWYgdmFsdWVUb01hcCB3YXMgaXRzZWxmIGxhdGVyIHJlbW92ZWRcbiAgICAgICAgICAgIG1hcHBlZE5vZGVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICBrby51dGlscy5hcnJheVB1c2hBbGwobWFwcGVkTm9kZXMsIG5ld01hcHBlZE5vZGVzKTtcbiAgICAgICAgfSwgbnVsbCwgeyBkaXNwb3NlV2hlbk5vZGVJc1JlbW92ZWQ6IGNvbnRhaW5lck5vZGUsIGRpc3Bvc2VXaGVuOiBmdW5jdGlvbigpIHsgcmV0dXJuICFrby51dGlscy5hbnlEb21Ob2RlSXNBdHRhY2hlZFRvRG9jdW1lbnQobWFwcGVkTm9kZXMpOyB9IH0pO1xuICAgICAgICByZXR1cm4geyBtYXBwZWROb2RlcyA6IG1hcHBlZE5vZGVzLCBkZXBlbmRlbnRPYnNlcnZhYmxlIDogKGRlcGVuZGVudE9ic2VydmFibGUuaXNBY3RpdmUoKSA/IGRlcGVuZGVudE9ic2VydmFibGUgOiB1bmRlZmluZWQpIH07XG4gICAgfVxuXG4gICAgdmFyIGxhc3RNYXBwaW5nUmVzdWx0RG9tRGF0YUtleSA9IGtvLnV0aWxzLmRvbURhdGEubmV4dEtleSgpLFxuICAgICAgICBkZWxldGVkSXRlbUR1bW15VmFsdWUgPSBrby51dGlscy5kb21EYXRhLm5leHRLZXkoKTtcblxuICAgIGtvLnV0aWxzLnNldERvbU5vZGVDaGlsZHJlbkZyb21BcnJheU1hcHBpbmcgPSBmdW5jdGlvbiAoZG9tTm9kZSwgYXJyYXksIG1hcHBpbmcsIG9wdGlvbnMsIGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2Rlcykge1xuICAgICAgICAvLyBDb21wYXJlIHRoZSBwcm92aWRlZCBhcnJheSBhZ2FpbnN0IHRoZSBwcmV2aW91cyBvbmVcbiAgICAgICAgYXJyYXkgPSBhcnJheSB8fCBbXTtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHZhciBpc0ZpcnN0RXhlY3V0aW9uID0ga28udXRpbHMuZG9tRGF0YS5nZXQoZG9tTm9kZSwgbGFzdE1hcHBpbmdSZXN1bHREb21EYXRhS2V5KSA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgbGFzdE1hcHBpbmdSZXN1bHQgPSBrby51dGlscy5kb21EYXRhLmdldChkb21Ob2RlLCBsYXN0TWFwcGluZ1Jlc3VsdERvbURhdGFLZXkpIHx8IFtdO1xuICAgICAgICB2YXIgbGFzdEFycmF5ID0ga28udXRpbHMuYXJyYXlNYXAobGFzdE1hcHBpbmdSZXN1bHQsIGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LmFycmF5RW50cnk7IH0pO1xuICAgICAgICB2YXIgZWRpdFNjcmlwdCA9IGtvLnV0aWxzLmNvbXBhcmVBcnJheXMobGFzdEFycmF5LCBhcnJheSwgb3B0aW9uc1snZG9udExpbWl0TW92ZXMnXSk7XG5cbiAgICAgICAgLy8gQnVpbGQgdGhlIG5ldyBtYXBwaW5nIHJlc3VsdFxuICAgICAgICB2YXIgbmV3TWFwcGluZ1Jlc3VsdCA9IFtdO1xuICAgICAgICB2YXIgbGFzdE1hcHBpbmdSZXN1bHRJbmRleCA9IDA7XG4gICAgICAgIHZhciBuZXdNYXBwaW5nUmVzdWx0SW5kZXggPSAwO1xuXG4gICAgICAgIHZhciBub2Rlc1RvRGVsZXRlID0gW107XG4gICAgICAgIHZhciBpdGVtc1RvUHJvY2VzcyA9IFtdO1xuICAgICAgICB2YXIgaXRlbXNGb3JCZWZvcmVSZW1vdmVDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdmFyIGl0ZW1zRm9yTW92ZUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB2YXIgaXRlbXNGb3JBZnRlckFkZENhbGxiYWNrcyA9IFtdO1xuICAgICAgICB2YXIgbWFwRGF0YTtcblxuICAgICAgICBmdW5jdGlvbiBpdGVtTW92ZWRPclJldGFpbmVkKGVkaXRTY3JpcHRJbmRleCwgb2xkUG9zaXRpb24pIHtcbiAgICAgICAgICAgIG1hcERhdGEgPSBsYXN0TWFwcGluZ1Jlc3VsdFtvbGRQb3NpdGlvbl07XG4gICAgICAgICAgICBpZiAobmV3TWFwcGluZ1Jlc3VsdEluZGV4ICE9PSBvbGRQb3NpdGlvbilcbiAgICAgICAgICAgICAgICBpdGVtc0Zvck1vdmVDYWxsYmFja3NbZWRpdFNjcmlwdEluZGV4XSA9IG1hcERhdGE7XG4gICAgICAgICAgICAvLyBTaW5jZSB1cGRhdGluZyB0aGUgaW5kZXggbWlnaHQgY2hhbmdlIHRoZSBub2RlcywgZG8gc28gYmVmb3JlIGNhbGxpbmcgZml4VXBDb250aW51b3VzTm9kZUFycmF5XG4gICAgICAgICAgICBtYXBEYXRhLmluZGV4T2JzZXJ2YWJsZShuZXdNYXBwaW5nUmVzdWx0SW5kZXgrKyk7XG4gICAgICAgICAgICBrby51dGlscy5maXhVcENvbnRpbnVvdXNOb2RlQXJyYXkobWFwRGF0YS5tYXBwZWROb2RlcywgZG9tTm9kZSk7XG4gICAgICAgICAgICBuZXdNYXBwaW5nUmVzdWx0LnB1c2gobWFwRGF0YSk7XG4gICAgICAgICAgICBpdGVtc1RvUHJvY2Vzcy5wdXNoKG1hcERhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2FsbENhbGxiYWNrKGNhbGxiYWNrLCBpdGVtcykge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIG4gPSBpdGVtcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1zW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2goaXRlbXNbaV0ubWFwcGVkTm9kZXMsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhub2RlLCBpLCBpdGVtc1tpXS5hcnJheUVudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGVkaXRTY3JpcHRJdGVtLCBtb3ZlZEluZGV4OyBlZGl0U2NyaXB0SXRlbSA9IGVkaXRTY3JpcHRbaV07IGkrKykge1xuICAgICAgICAgICAgbW92ZWRJbmRleCA9IGVkaXRTY3JpcHRJdGVtWydtb3ZlZCddO1xuICAgICAgICAgICAgc3dpdGNoIChlZGl0U2NyaXB0SXRlbVsnc3RhdHVzJ10pIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGVsZXRlZFwiOlxuICAgICAgICAgICAgICAgICAgICBpZiAobW92ZWRJbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBEYXRhID0gbGFzdE1hcHBpbmdSZXN1bHRbbGFzdE1hcHBpbmdSZXN1bHRJbmRleF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0b3AgdHJhY2tpbmcgY2hhbmdlcyB0byB0aGUgbWFwcGluZyBmb3IgdGhlc2Ugbm9kZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBEYXRhLmRlcGVuZGVudE9ic2VydmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBEYXRhLmRlcGVuZGVudE9ic2VydmFibGUuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcERhdGEuZGVwZW5kZW50T2JzZXJ2YWJsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUXVldWUgdGhlc2Ugbm9kZXMgZm9yIGxhdGVyIHJlbW92YWxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrby51dGlscy5maXhVcENvbnRpbnVvdXNOb2RlQXJyYXkobWFwRGF0YS5tYXBwZWROb2RlcywgZG9tTm9kZSkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnNbJ2JlZm9yZVJlbW92ZSddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld01hcHBpbmdSZXN1bHQucHVzaChtYXBEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNUb1Byb2Nlc3MucHVzaChtYXBEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcERhdGEuYXJyYXlFbnRyeSA9PT0gZGVsZXRlZEl0ZW1EdW1teVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBEYXRhID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zRm9yQmVmb3JlUmVtb3ZlQ2FsbGJhY2tzW2ldID0gbWFwRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2Rlc1RvRGVsZXRlLnB1c2guYXBwbHkobm9kZXNUb0RlbGV0ZSwgbWFwRGF0YS5tYXBwZWROb2Rlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxhc3RNYXBwaW5nUmVzdWx0SW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwicmV0YWluZWRcIjpcbiAgICAgICAgICAgICAgICAgICAgaXRlbU1vdmVkT3JSZXRhaW5lZChpLCBsYXN0TWFwcGluZ1Jlc3VsdEluZGV4KyspO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJhZGRlZFwiOlxuICAgICAgICAgICAgICAgICAgICBpZiAobW92ZWRJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtTW92ZWRPclJldGFpbmVkKGksIG1vdmVkSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFwRGF0YSA9IHsgYXJyYXlFbnRyeTogZWRpdFNjcmlwdEl0ZW1bJ3ZhbHVlJ10sIGluZGV4T2JzZXJ2YWJsZToga28ub2JzZXJ2YWJsZShuZXdNYXBwaW5nUmVzdWx0SW5kZXgrKykgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld01hcHBpbmdSZXN1bHQucHVzaChtYXBEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zVG9Qcm9jZXNzLnB1c2gobWFwRGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRmlyc3RFeGVjdXRpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNGb3JBZnRlckFkZENhbGxiYWNrc1tpXSA9IG1hcERhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdG9yZSBhIGNvcHkgb2YgdGhlIGFycmF5IGl0ZW1zIHdlIGp1c3QgY29uc2lkZXJlZCBzbyB3ZSBjYW4gZGlmZmVyZW5jZSBpdCBuZXh0IHRpbWVcbiAgICAgICAga28udXRpbHMuZG9tRGF0YS5zZXQoZG9tTm9kZSwgbGFzdE1hcHBpbmdSZXN1bHREb21EYXRhS2V5LCBuZXdNYXBwaW5nUmVzdWx0KTtcblxuICAgICAgICAvLyBDYWxsIGJlZm9yZU1vdmUgZmlyc3QgYmVmb3JlIGFueSBjaGFuZ2VzIGhhdmUgYmVlbiBtYWRlIHRvIHRoZSBET01cbiAgICAgICAgY2FsbENhbGxiYWNrKG9wdGlvbnNbJ2JlZm9yZU1vdmUnXSwgaXRlbXNGb3JNb3ZlQ2FsbGJhY2tzKTtcblxuICAgICAgICAvLyBOZXh0IHJlbW92ZSBub2RlcyBmb3IgZGVsZXRlZCBpdGVtcyAob3IganVzdCBjbGVhbiBpZiB0aGVyZSdzIGEgYmVmb3JlUmVtb3ZlIGNhbGxiYWNrKVxuICAgICAgICBrby51dGlscy5hcnJheUZvckVhY2gobm9kZXNUb0RlbGV0ZSwgb3B0aW9uc1snYmVmb3JlUmVtb3ZlJ10gPyBrby5jbGVhbk5vZGUgOiBrby5yZW1vdmVOb2RlKTtcblxuICAgICAgICAvLyBOZXh0IGFkZC9yZW9yZGVyIHRoZSByZW1haW5pbmcgaXRlbXMgKHdpbGwgaW5jbHVkZSBkZWxldGVkIGl0ZW1zIGlmIHRoZXJlJ3MgYSBiZWZvcmVSZW1vdmUgY2FsbGJhY2spXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBuZXh0Tm9kZSA9IGtvLnZpcnR1YWxFbGVtZW50cy5maXJzdENoaWxkKGRvbU5vZGUpLCBsYXN0Tm9kZSwgbm9kZTsgbWFwRGF0YSA9IGl0ZW1zVG9Qcm9jZXNzW2ldOyBpKyspIHtcbiAgICAgICAgICAgIC8vIEdldCBub2RlcyBmb3IgbmV3bHkgYWRkZWQgaXRlbXNcbiAgICAgICAgICAgIGlmICghbWFwRGF0YS5tYXBwZWROb2RlcylcbiAgICAgICAgICAgICAgICBrby51dGlscy5leHRlbmQobWFwRGF0YSwgbWFwTm9kZUFuZFJlZnJlc2hXaGVuQ2hhbmdlZChkb21Ob2RlLCBtYXBwaW5nLCBtYXBEYXRhLmFycmF5RW50cnksIGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2RlcywgbWFwRGF0YS5pbmRleE9ic2VydmFibGUpKTtcblxuICAgICAgICAgICAgLy8gUHV0IG5vZGVzIGluIHRoZSByaWdodCBwbGFjZSBpZiB0aGV5IGFyZW4ndCB0aGVyZSBhbHJlYWR5XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgbm9kZSA9IG1hcERhdGEubWFwcGVkTm9kZXNbal07IG5leHROb2RlID0gbm9kZS5uZXh0U2libGluZywgbGFzdE5vZGUgPSBub2RlLCBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZSAhPT0gbmV4dE5vZGUpXG4gICAgICAgICAgICAgICAgICAgIGtvLnZpcnR1YWxFbGVtZW50cy5pbnNlcnRBZnRlcihkb21Ob2RlLCBub2RlLCBsYXN0Tm9kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJ1biB0aGUgY2FsbGJhY2tzIGZvciBuZXdseSBhZGRlZCBub2RlcyAoZm9yIGV4YW1wbGUsIHRvIGFwcGx5IGJpbmRpbmdzLCBldGMuKVxuICAgICAgICAgICAgaWYgKCFtYXBEYXRhLmluaXRpYWxpemVkICYmIGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2Rlcykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrQWZ0ZXJBZGRpbmdOb2RlcyhtYXBEYXRhLmFycmF5RW50cnksIG1hcERhdGEubWFwcGVkTm9kZXMsIG1hcERhdGEuaW5kZXhPYnNlcnZhYmxlKTtcbiAgICAgICAgICAgICAgICBtYXBEYXRhLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZXJlJ3MgYSBiZWZvcmVSZW1vdmUgY2FsbGJhY2ssIGNhbGwgaXQgYWZ0ZXIgcmVvcmRlcmluZy5cbiAgICAgICAgLy8gTm90ZSB0aGF0IHdlIGFzc3VtZSB0aGF0IHRoZSBiZWZvcmVSZW1vdmUgY2FsbGJhY2sgd2lsbCB1c3VhbGx5IGJlIHVzZWQgdG8gcmVtb3ZlIHRoZSBub2RlcyB1c2luZ1xuICAgICAgICAvLyBzb21lIHNvcnQgb2YgYW5pbWF0aW9uLCB3aGljaCBpcyB3aHkgd2UgZmlyc3QgcmVvcmRlciB0aGUgbm9kZXMgdGhhdCB3aWxsIGJlIHJlbW92ZWQuIElmIHRoZVxuICAgICAgICAvLyBjYWxsYmFjayBpbnN0ZWFkIHJlbW92ZXMgdGhlIG5vZGVzIHJpZ2h0IGF3YXksIGl0IHdvdWxkIGJlIG1vcmUgZWZmaWNpZW50IHRvIHNraXAgcmVvcmRlcmluZyB0aGVtLlxuICAgICAgICAvLyBQZXJoYXBzIHdlJ2xsIG1ha2UgdGhhdCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZSBpZiB0aGlzIHNjZW5hcmlvIGJlY29tZXMgbW9yZSBjb21tb24uXG4gICAgICAgIGNhbGxDYWxsYmFjayhvcHRpb25zWydiZWZvcmVSZW1vdmUnXSwgaXRlbXNGb3JCZWZvcmVSZW1vdmVDYWxsYmFja3MpO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIHN0b3JlZCB2YWx1ZXMgb2YgZGVsZXRlZCBpdGVtcyB3aXRoIGEgZHVtbXkgdmFsdWUuIFRoaXMgcHJvdmlkZXMgdHdvIGJlbmVmaXRzOiBpdCBtYXJrcyB0aGlzIGl0ZW1cbiAgICAgICAgLy8gYXMgYWxyZWFkeSBcInJlbW92ZWRcIiBzbyB3ZSB3b24ndCBjYWxsIGJlZm9yZVJlbW92ZSBmb3IgaXQgYWdhaW4sIGFuZCBpdCBlbnN1cmVzIHRoYXQgdGhlIGl0ZW0gd29uJ3QgbWF0Y2ggdXBcbiAgICAgICAgLy8gd2l0aCBhbiBhY3R1YWwgaXRlbSBpbiB0aGUgYXJyYXkgYW5kIGFwcGVhciBhcyBcInJldGFpbmVkXCIgb3IgXCJtb3ZlZFwiLlxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbXNGb3JCZWZvcmVSZW1vdmVDYWxsYmFja3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChpdGVtc0ZvckJlZm9yZVJlbW92ZUNhbGxiYWNrc1tpXSkge1xuICAgICAgICAgICAgICAgIGl0ZW1zRm9yQmVmb3JlUmVtb3ZlQ2FsbGJhY2tzW2ldLmFycmF5RW50cnkgPSBkZWxldGVkSXRlbUR1bW15VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaW5hbGx5IGNhbGwgYWZ0ZXJNb3ZlIGFuZCBhZnRlckFkZCBjYWxsYmFja3NcbiAgICAgICAgY2FsbENhbGxiYWNrKG9wdGlvbnNbJ2FmdGVyTW92ZSddLCBpdGVtc0Zvck1vdmVDYWxsYmFja3MpO1xuICAgICAgICBjYWxsQ2FsbGJhY2sob3B0aW9uc1snYWZ0ZXJBZGQnXSwgaXRlbXNGb3JBZnRlckFkZENhbGxiYWNrcyk7XG4gICAgfVxufSkoKTtcblxua28uZXhwb3J0U3ltYm9sKCd1dGlscy5zZXREb21Ob2RlQ2hpbGRyZW5Gcm9tQXJyYXlNYXBwaW5nJywga28udXRpbHMuc2V0RG9tTm9kZUNoaWxkcmVuRnJvbUFycmF5TWFwcGluZyk7XG5rby5uYXRpdmVUZW1wbGF0ZUVuZ2luZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzWydhbGxvd1RlbXBsYXRlUmV3cml0aW5nJ10gPSBmYWxzZTtcbn1cblxua28ubmF0aXZlVGVtcGxhdGVFbmdpbmUucHJvdG90eXBlID0gbmV3IGtvLnRlbXBsYXRlRW5naW5lKCk7XG5rby5uYXRpdmVUZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZTtcbmtvLm5hdGl2ZVRlbXBsYXRlRW5naW5lLnByb3RvdHlwZVsncmVuZGVyVGVtcGxhdGVTb3VyY2UnXSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVNvdXJjZSwgYmluZGluZ0NvbnRleHQsIG9wdGlvbnMsIHRlbXBsYXRlRG9jdW1lbnQpIHtcbiAgICB2YXIgdXNlTm9kZXNJZkF2YWlsYWJsZSA9ICEoa28udXRpbHMuaWVWZXJzaW9uIDwgOSksIC8vIElFPDkgY2xvbmVOb2RlIGRvZXNuJ3Qgd29yayBwcm9wZXJseVxuICAgICAgICB0ZW1wbGF0ZU5vZGVzRnVuYyA9IHVzZU5vZGVzSWZBdmFpbGFibGUgPyB0ZW1wbGF0ZVNvdXJjZVsnbm9kZXMnXSA6IG51bGwsXG4gICAgICAgIHRlbXBsYXRlTm9kZXMgPSB0ZW1wbGF0ZU5vZGVzRnVuYyA/IHRlbXBsYXRlU291cmNlWydub2RlcyddKCkgOiBudWxsO1xuXG4gICAgaWYgKHRlbXBsYXRlTm9kZXMpIHtcbiAgICAgICAgcmV0dXJuIGtvLnV0aWxzLm1ha2VBcnJheSh0ZW1wbGF0ZU5vZGVzLmNsb25lTm9kZSh0cnVlKS5jaGlsZE5vZGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdGVtcGxhdGVUZXh0ID0gdGVtcGxhdGVTb3VyY2VbJ3RleHQnXSgpO1xuICAgICAgICByZXR1cm4ga28udXRpbHMucGFyc2VIdG1sRnJhZ21lbnQodGVtcGxhdGVUZXh0LCB0ZW1wbGF0ZURvY3VtZW50KTtcbiAgICB9XG59O1xuXG5rby5uYXRpdmVUZW1wbGF0ZUVuZ2luZS5pbnN0YW5jZSA9IG5ldyBrby5uYXRpdmVUZW1wbGF0ZUVuZ2luZSgpO1xua28uc2V0VGVtcGxhdGVFbmdpbmUoa28ubmF0aXZlVGVtcGxhdGVFbmdpbmUuaW5zdGFuY2UpO1xuXG5rby5leHBvcnRTeW1ib2woJ25hdGl2ZVRlbXBsYXRlRW5naW5lJywga28ubmF0aXZlVGVtcGxhdGVFbmdpbmUpO1xuKGZ1bmN0aW9uKCkge1xuICAgIGtvLmpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gRGV0ZWN0IHdoaWNoIHZlcnNpb24gb2YganF1ZXJ5LXRtcGwgeW91J3JlIHVzaW5nLiBVbmZvcnR1bmF0ZWx5IGpxdWVyeS10bXBsXG4gICAgICAgIC8vIGRvZXNuJ3QgZXhwb3NlIGEgdmVyc2lvbiBudW1iZXIsIHNvIHdlIGhhdmUgdG8gaW5mZXIgaXQuXG4gICAgICAgIC8vIE5vdGUgdGhhdCBhcyBvZiBLbm9ja291dCAxLjMsIHdlIG9ubHkgc3VwcG9ydCBqUXVlcnkudG1wbCAxLjAuMHByZSBhbmQgbGF0ZXIsXG4gICAgICAgIC8vIHdoaWNoIEtPIGludGVybmFsbHkgcmVmZXJzIHRvIGFzIHZlcnNpb24gXCIyXCIsIHNvIG9sZGVyIHZlcnNpb25zIGFyZSBubyBsb25nZXIgZGV0ZWN0ZWQuXG4gICAgICAgIHZhciBqUXVlcnlUbXBsVmVyc2lvbiA9IHRoaXMualF1ZXJ5VG1wbFZlcnNpb24gPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIWpRdWVyeUluc3RhbmNlIHx8ICEoalF1ZXJ5SW5zdGFuY2VbJ3RtcGwnXSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAvLyBTaW5jZSBpdCBleHBvc2VzIG5vIG9mZmljaWFsIHZlcnNpb24gbnVtYmVyLCB3ZSB1c2Ugb3VyIG93biBudW1iZXJpbmcgc3lzdGVtLiBUbyBiZSB1cGRhdGVkIGFzIGpxdWVyeS10bXBsIGV2b2x2ZXMuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChqUXVlcnlJbnN0YW5jZVsndG1wbCddWyd0YWcnXVsndG1wbCddWydvcGVuJ10udG9TdHJpbmcoKS5pbmRleE9mKCdfXycpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2UgMS4wLjBwcmUsIGN1c3RvbSB0YWdzIHNob3VsZCBhcHBlbmQgbWFya3VwIHRvIGFuIGFycmF5IGNhbGxlZCBcIl9fXCJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDI7IC8vIEZpbmFsIHZlcnNpb24gb2YganF1ZXJ5LnRtcGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoKGV4KSB7IC8qIEFwcGFyZW50bHkgbm90IHRoZSB2ZXJzaW9uIHdlIHdlcmUgbG9va2luZyBmb3IgKi8gfVxuXG4gICAgICAgICAgICByZXR1cm4gMTsgLy8gQW55IG9sZGVyIHZlcnNpb24gdGhhdCB3ZSBkb24ndCBzdXBwb3J0XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gZW5zdXJlSGFzUmVmZXJlbmNlZEpRdWVyeVRlbXBsYXRlcygpIHtcbiAgICAgICAgICAgIGlmIChqUXVlcnlUbXBsVmVyc2lvbiA8IDIpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWW91ciB2ZXJzaW9uIG9mIGpRdWVyeS50bXBsIGlzIHRvbyBvbGQuIFBsZWFzZSB1cGdyYWRlIHRvIGpRdWVyeS50bXBsIDEuMC4wcHJlIG9yIGxhdGVyLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGV4ZWN1dGVUZW1wbGF0ZShjb21waWxlZFRlbXBsYXRlLCBkYXRhLCBqUXVlcnlUZW1wbGF0ZU9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBqUXVlcnlJbnN0YW5jZVsndG1wbCddKGNvbXBpbGVkVGVtcGxhdGUsIGRhdGEsIGpRdWVyeVRlbXBsYXRlT3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzWydyZW5kZXJUZW1wbGF0ZVNvdXJjZSddID0gZnVuY3Rpb24odGVtcGxhdGVTb3VyY2UsIGJpbmRpbmdDb250ZXh0LCBvcHRpb25zLCB0ZW1wbGF0ZURvY3VtZW50KSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZURvY3VtZW50ID0gdGVtcGxhdGVEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgZW5zdXJlSGFzUmVmZXJlbmNlZEpRdWVyeVRlbXBsYXRlcygpO1xuXG4gICAgICAgICAgICAvLyBFbnN1cmUgd2UgaGF2ZSBzdG9yZWQgYSBwcmVjb21waWxlZCB2ZXJzaW9uIG9mIHRoaXMgdGVtcGxhdGUgKGRvbid0IHdhbnQgdG8gcmVwYXJzZSBvbiBldmVyeSByZW5kZXIpXG4gICAgICAgICAgICB2YXIgcHJlY29tcGlsZWQgPSB0ZW1wbGF0ZVNvdXJjZVsnZGF0YSddKCdwcmVjb21waWxlZCcpO1xuICAgICAgICAgICAgaWYgKCFwcmVjb21waWxlZCkge1xuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZVRleHQgPSB0ZW1wbGF0ZVNvdXJjZVsndGV4dCddKCkgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICAvLyBXcmFwIGluIFwid2l0aCgkd2hhdGV2ZXIua29CaW5kaW5nQ29udGV4dCkgeyAuLi4gfVwiXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVUZXh0ID0gXCJ7e2tvX3dpdGggJGl0ZW0ua29CaW5kaW5nQ29udGV4dH19XCIgKyB0ZW1wbGF0ZVRleHQgKyBcInt7L2tvX3dpdGh9fVwiO1xuXG4gICAgICAgICAgICAgICAgcHJlY29tcGlsZWQgPSBqUXVlcnlJbnN0YW5jZVsndGVtcGxhdGUnXShudWxsLCB0ZW1wbGF0ZVRleHQpO1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlU291cmNlWydkYXRhJ10oJ3ByZWNvbXBpbGVkJywgcHJlY29tcGlsZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGF0YSA9IFtiaW5kaW5nQ29udGV4dFsnJGRhdGEnXV07IC8vIFByZXdyYXAgdGhlIGRhdGEgaW4gYW4gYXJyYXkgdG8gc3RvcCBqcXVlcnkudG1wbCBmcm9tIHRyeWluZyB0byB1bndyYXAgYW55IGFycmF5c1xuICAgICAgICAgICAgdmFyIGpRdWVyeVRlbXBsYXRlT3B0aW9ucyA9IGpRdWVyeUluc3RhbmNlWydleHRlbmQnXSh7ICdrb0JpbmRpbmdDb250ZXh0JzogYmluZGluZ0NvbnRleHQgfSwgb3B0aW9uc1sndGVtcGxhdGVPcHRpb25zJ10pO1xuXG4gICAgICAgICAgICB2YXIgcmVzdWx0Tm9kZXMgPSBleGVjdXRlVGVtcGxhdGUocHJlY29tcGlsZWQsIGRhdGEsIGpRdWVyeVRlbXBsYXRlT3B0aW9ucyk7XG4gICAgICAgICAgICByZXN1bHROb2Rlc1snYXBwZW5kVG8nXSh0ZW1wbGF0ZURvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpOyAvLyBVc2luZyBcImFwcGVuZFRvXCIgZm9yY2VzIGpRdWVyeS9qUXVlcnkudG1wbCB0byBwZXJmb3JtIG5lY2Vzc2FyeSBjbGVhbnVwIHdvcmtcblxuICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2VbJ2ZyYWdtZW50cyddID0ge307IC8vIENsZWFyIGpRdWVyeSdzIGZyYWdtZW50IGNhY2hlIHRvIGF2b2lkIGEgbWVtb3J5IGxlYWsgYWZ0ZXIgYSBsYXJnZSBudW1iZXIgb2YgdGVtcGxhdGUgcmVuZGVyc1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdE5vZGVzO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXNbJ2NyZWF0ZUphdmFTY3JpcHRFdmFsdWF0b3JCbG9jayddID0gZnVuY3Rpb24oc2NyaXB0KSB7XG4gICAgICAgICAgICByZXR1cm4gXCJ7e2tvX2NvZGUgKChmdW5jdGlvbigpIHsgcmV0dXJuIFwiICsgc2NyaXB0ICsgXCIgfSkoKSkgfX1cIjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzWydhZGRUZW1wbGF0ZSddID0gZnVuY3Rpb24odGVtcGxhdGVOYW1lLCB0ZW1wbGF0ZU1hcmt1cCkge1xuICAgICAgICAgICAgZG9jdW1lbnQud3JpdGUoXCI8c2NyaXB0IHR5cGU9J3RleHQvaHRtbCcgaWQ9J1wiICsgdGVtcGxhdGVOYW1lICsgXCInPlwiICsgdGVtcGxhdGVNYXJrdXAgKyBcIjxcIiArIFwiL3NjcmlwdD5cIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGpRdWVyeVRtcGxWZXJzaW9uID4gMCkge1xuICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2VbJ3RtcGwnXVsndGFnJ11bJ2tvX2NvZGUnXSA9IHtcbiAgICAgICAgICAgICAgICBvcGVuOiBcIl9fLnB1c2goJDEgfHwgJycpO1wiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgalF1ZXJ5SW5zdGFuY2VbJ3RtcGwnXVsndGFnJ11bJ2tvX3dpdGgnXSA9IHtcbiAgICAgICAgICAgICAgICBvcGVuOiBcIndpdGgoJDEpIHtcIixcbiAgICAgICAgICAgICAgICBjbG9zZTogXCJ9IFwiXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGtvLmpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZS5wcm90b3R5cGUgPSBuZXcga28udGVtcGxhdGVFbmdpbmUoKTtcbiAgICBrby5qcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0ga28uanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lO1xuXG4gICAgLy8gVXNlIHRoaXMgb25lIGJ5IGRlZmF1bHQgKm9ubHkgaWYganF1ZXJ5LnRtcGwgaXMgcmVmZXJlbmNlZCpcbiAgICB2YXIganF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lSW5zdGFuY2UgPSBuZXcga28uanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lKCk7XG4gICAgaWYgKGpxdWVyeVRtcGxUZW1wbGF0ZUVuZ2luZUluc3RhbmNlLmpRdWVyeVRtcGxWZXJzaW9uID4gMClcbiAgICAgICAga28uc2V0VGVtcGxhdGVFbmdpbmUoanF1ZXJ5VG1wbFRlbXBsYXRlRW5naW5lSW5zdGFuY2UpO1xuXG4gICAga28uZXhwb3J0U3ltYm9sKCdqcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmUnLCBrby5qcXVlcnlUbXBsVGVtcGxhdGVFbmdpbmUpO1xufSkoKTtcbn0pKTtcbn0oKSk7XG59KSgpO1xuIiwi77u/aW1wb3J0IGtvIGZyb20gXCJrbm9ja291dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEtub2Nrb3V0U2VydmljZSB7XHJcblxyXG4gICAgc3RhdGljIHJlZ2lzdGVyQ29tcG9uZW50KG5hbWUsIHZpZXdNb2RlbCwgdGVtcGxhdGUpIHtcclxuICAgICAgICBjb25zdCBjb21wb25lbnRDb25maWcgPSB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcclxuICAgICAgICAgICAgdmlld01vZGVsOiB2aWV3TW9kZWxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBrby5jb21wb25lbnRzLnJlZ2lzdGVyKG5hbWUsIGNvbXBvbmVudENvbmZpZyk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7IEtub2Nrb3V0U2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9rbm9ja291dC5zZXJ2aWNlXCI7XHJcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tIFwiLi9kYXNoYm9hcmQuaHRtbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhc2hib2FyZCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbnN0IHZpZXdNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy50YXNrcyA9IGtvLm9ic2VydmFibGVBcnJheShzZWxmLmdldFRhc2tzKCkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEtub2Nrb3V0U2VydmljZS5yZWdpc3RlckNvbXBvbmVudChcImV6eS1kYXNoYm9hcmRcIiwgdmlld01vZGVsLCB0ZW1wbGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGFza3MoKSB7XHJcbiAgICAgICAgdmFyIHRhc2tzID0gW107XHJcbiAgICAgICAgdGFza3MucHVzaCh7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uOiBcIlR3byBzZXBhcmF0ZSAuTkVUIHN5c3RlbXMgYXJlIHNldCB1cCB0byB2YWxpZGF0ZSBNRDUga2V5cyAob3IgU0hBMSBldGMpIGZyb20gYSBkYXRhYmFzZS4gVGhlIE1ENSBrZXlzIGFyZSBnZW5lcmF0ZWQgZnJvbSBhIGxpc3Qgb2YgZW1wbG95ZWUgbmFtZXMuIFRoZSB2YWxpZGF0aW9uIGlzIG1hdGNoaW5nIDEwMCUgb24gb25lIHN5c3RlbSwgYnV0IG9ubHkgOTUlIG9uIHRoZSBvdGhlciBzeXN0ZW0uIFdoYXQgaXMgdGhlIG1vc3QgcHJvYmFibGUgcmVhc29uIGZvciB0aGlzP1wiLFxyXG4gICAgICAgICAgICBhbnN3ZXI6IFwiU29tZSBhbnN3ZXIgPGI+U29tZSB0aGluZzwvYj5cIixcclxuICAgICAgICAgICAgY29tcG9uZW50OiBudWxsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGFza3MucHVzaCh7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uOiBcIlRoZSBjb2RlIGJlbG93IGlzIHVzZWQgaW4gYW4gQVNQLk5FVCBhcHBsaWNhdGlvbiB3aGVyZSDigJ1HcmVldGluZ1NlcnZpY2UuQ3VycmVudEdyZWV0aW5n4oCdaXMgZmV0Y2hlZCBhdCB0aGUgZm9sbG93aW5nIHRpbWVzOiAwOCwgMTIgYW5kIDE2LiBXaGljaCBtZXNzYWdlIGlzIHJldHVybmVkIG9uIGVhY2ggcnVuP1wiLFxyXG4gICAgICAgICAgICBhbnN3ZXI6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICBjb21wb25lbnQ6IG51bGxcclxuICAgICAgICB9KTtcclxuICAgICAgICB0YXNrcy5wdXNoKHtcclxuICAgICAgICAgICAgcXVlc3Rpb246IFwiRW50aXR5IEZyYW1ld29yayBpcyB1c2VkIHRvIGZldGNoIGRhdGEgZnJvbSBhIHRhYmxlIGluIGEgZGF0YWJhc2UgYW5kIGRpc3BsYXkgdGhlIHJlc3VsdCB3aXRoIGEgdGV4dCBoZWFkZXIgdGhhdCBzaG93cyB0aGUgdG90YWwgbnVtYmVyIG9mIHJvd3MgcmV0dXJuZWQgaW4gdGhlIHJlc3VsdC4gV2hpY2ggb2YgdGhlIGZvbGxvd2luZyB2ZXJzaW9ucyB3b3VsZCB5b3Ugc3VnZ2VzdCwgYW5kIHdoeT9cIixcclxuICAgICAgICAgICAgYW5zd2VyOiBcIlNvbWUgYW5zd2VyIDJcIixcclxuICAgICAgICAgICAgY29tcG9uZW50OiBudWxsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGFza3MucHVzaCh7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uOiBcIlVuZGVyIHdoaWNoIGNpcmN1bXN0YW5jZXMgaXMgdGhlIGluLW1lbW9yeSAoZGVmYXVsdCkgQ2FjaGUgaW4gQVNQLk5FVCBjbGVhcmVkP1wiLFxyXG4gICAgICAgICAgICBhbnN3ZXI6IFwiV2hlbiB0aGUgQXBwbGljYXRpb24gUG9vbCBpcyByZWN5Y2xlZC5cIixcclxuICAgICAgICAgICAgY29tcG9uZW50OiBudWxsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGFza3MucHVzaCh7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uOiBcIldoYXQgaXMgY2xlYW4gY29kZT8gUGxlYXNlIGRlc2NyaWJlIGtleSBwb2ludHMgeW91IHVzZSBpbiB5b3VyIGV2ZXJ5ZGF5IHdvcmsuXCIsXHJcbiAgICAgICAgICAgIGFuc3dlcjogXCJTb21lIGFuc3dlciAyXCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudDogbnVsbFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRhc2tzLnB1c2goe1xyXG4gICAgICAgICAgICBxdWVzdGlvbjogXCJXZSBoYXZlIHByb2JsZW0gd2l0aCBzY3JhcGVycyBkb2luZyBhIGxvdCBvZiBzZWFyY2hlcyBvbiB0aGUgc2l0ZS4gV2Ugd2FudCB0byBnZW5lcmF0ZSBhIGxpc3Qgb2YgaXBzIHRoYXQgZG8gdW51c3VhbCBhbW91bnQgb2Ygc2VhcmNoZXMsIGFuZCBhbHNvIGhhdmUgdGhlIGFiaWxpdHkgdG8gYmxvY2sgdGhlbS4gSW1hZ2luZSDigJxTZWFyY2jigJ0gYmVsb3cgYmVpbmcgY2FsbGVkIHZlcnkgb2Z0ZW4gYnkgbWFueSB1c2VycyBhdCB0aGUgc2FtZSB0aW1lLiBXaGF0IHBvdGVudGlhbCBwcm9ibGVtcyBjYW4gd2UgcnVuIGludG8/XCIsXHJcbiAgICAgICAgICAgIGFuc3dlcjogXCJTb21lIGFuc3dlciAyXCIsXHJcbiAgICAgICAgICAgIGNvbXBvbmVudDogbnVsbFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRhc2tzLnB1c2goe1xyXG4gICAgICAgICAgICBxdWVzdGlvbjogXCJUYWtlIGEgbG9vayBhdCB0aGUgZm9sbG93aW5nIGJhZGx5IHdyaXR0ZW4gcGFnZS4gUGxlYXNlIHJld3JpdGUgaXQgYXMgeW91IHdvdWxkIGhhdmUgZG9uZSBpdCwgaXQgZG9u4oCZdCBuZWVkIHRvIGJlIGV4YWN0bHkgdGhlIHNhbWUgcmVzdWx0LCBidXQgc2ltaWxhci4gWW91IGNhbiBjaGFuZ2UgYW55IGNvZGUgdGhhdCB5b3UgZG9u4oCZdCB0aGluayBpcyB3ZWxsIGRvbmUgYW5kIHJlYXBwbHkgaXQgaW4gYSBkaWZmZXJlbnQgd2F5LiBVc2UgYmVzdCBwcmFjdGljZXMgcmVnYXJkaW5nIEhUTUwsIEpTLCBDU1MgYnV0IGFsc28gcmVnYXJkaW5nIGFyY2hpdGVjdHVyZSBhbmQgcGVyZm9ybWFuY2UuICBVc2luZyBmb3IgZXhhbXBsZSBqYXZhc2NyaXB0IG1vZHVsZSBwYXR0ZXJuIGFuZCBvcHRpb25hbGx5IEtub2Nrb3V0SlMgb3Igb3RoZXIgZnJhbWV3b3JrIHRvIGJpbmQgdGhlIEpTIHdpdGggaHRtbC5cIixcclxuICAgICAgICAgICAgYW5zd2VyOiBcIkNyZWF0ZWQgYSBLbm9ja291dCBjb21wb25lbnQuIFBsZWFzZSBzZWUgL3VpL2FwcC9cIixcclxuICAgICAgICAgICAgY29tcG9uZW50OiBcImV6eS1iZXR0ZXItZXhhbXBsZVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGFza3MucHVzaCh7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uOiBcIkNyZWF0ZSBhIHdlYiBwYWdlIHdpdGggYSBidXR0b24uIFdoZW4geW91IGNsaWNrIG9uIHRoZSBidXR0b24gdGhlIGFwcGxpY2F0aW9uIHNob3VsZCByZXRyaWV2ZSB0aGUgY3VycmVuY3kgcmF0ZXMgZm9yIFVTRCBhbmQgRVVSIGFuZCBkaXNwbGF5IHRoZW0gb24gdGhlIHBhZ2UuIEN1cnJlbmN5IHJhdGVzIGNhbiBiZSBmb3VuZCBvbjogaHR0cDovL3d3dy5mb3JleC5zZS9yYXRlc3htbC5hc3A/aWQ9NDkyLiBQbGVhc2UgdXNlIEFTUC5ORVQgTXZjIFByb2plY3QgdGhhdCBjYWxscyB2aWEgQUpBWCBlaXRoZXIgY2FsbHMgYSB3ZWJhcGkgbWV0aG9kIG9yIGEganNvbnJlc3VsdCBtZXRob2QsIHRoYXQncyBjb25zdW1pbmcgdGhlIGV4Y2hhbmdlIHNlcnZpY2UuIFBsZWFzZSB0aGluayBvZiBob3cgeW91IHN0cnVjdHVyZSB5b3VyIGNvZGUuVXNlOiBNVkMsIEphdmFzY3JpcHQgTW9kdWxlcGF0dGVybiwgYXN5bmMgY2FsbHMsIEtub2Nrb3V0anMgKG9wdGlvbmFsKVwiLFxyXG4gICAgICAgICAgICBhbnN3ZXI6IFwiQ3JlYXRlZCBhIEtub2Nrb3V0IGNvbXBvbmVudC4gUGxlYXNlIHNlZSAvdWkvYXBwL1wiLFxyXG4gICAgICAgICAgICBjb21wb25lbnQ6IFwiZXp5LWV4Y2hhbmdlLXJhdGVzXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhc2tzO1xyXG4gICAgfVxyXG59Iiwi77u/aW1wb3J0IGtvIGZyb20gXCJrbm9ja291dFwiO1xyXG5pbXBvcnQgeyBLbm9ja291dFNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMva25vY2tvdXQuc2VydmljZVwiO1xyXG5pbXBvcnQgdGVtcGxhdGUgZnJvbSBcIi4vZXhjaGFuZ2UtcmF0ZXMuaHRtbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV4Y2hhbmdlUmF0ZXMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbnN0IHZpZXdNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5yYXRlID0ga28ub2JzZXJ2YWJsZShzZWxmLmdldEV4Y2hhbmdlUmF0ZXMoKSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgS25vY2tvdXRTZXJ2aWNlLnJlZ2lzdGVyQ29tcG9uZW50KFwiZXp5LWV4Y2hhbmdlLXJhdGVzXCIsIHZpZXdNb2RlbCwgdGVtcGxhdGUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRFeGNoYW5nZVJhdGVzKCkge1xyXG4gICAgICAgIHJldHVybiBcIjEwMDExMTJcIjtcclxuICAgIH1cclxufSIsIu+7v2ltcG9ydCBrbyBmcm9tIFwia25vY2tvdXRcIjtcclxuaW1wb3J0IHsgS25vY2tvdXRTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL2tub2Nrb3V0LnNlcnZpY2VcIjtcclxuaW1wb3J0IHRlbXBsYXRlIGZyb20gXCIuL2JldHRlci1leGFtcGxlLmh0bWxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCZXR0ZXJFeGFtcGxlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbnN0IHZpZXdNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50RGF0ZVRpbWUgPSBrby5vYnNlcnZhYmxlKG5ldyBEYXRlKCkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEtub2Nrb3V0U2VydmljZS5yZWdpc3RlckNvbXBvbmVudChcImV6eS1iZXR0ZXItZXhhbXBsZVwiLCB2aWV3TW9kZWwsIHRlbXBsYXRlKTtcclxuICAgIH1cclxuXHJcbn0iLCLvu79pbXBvcnQga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7IEtub2Nrb3V0U2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9rbm9ja291dC5zZXJ2aWNlXCI7XHJcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tIFwiLi9yYXRlLXRhc2suaHRtbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJhdGVUYXNrIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB2aWV3TW9kZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuYXBwcm92ZWQgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcHJvdmVUYXNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHByb3ZlZCh0cnVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5kaXNhcHByb3ZlVGFzayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwcm92ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEtub2Nrb3V0U2VydmljZS5yZWdpc3RlckNvbXBvbmVudChcImV6eS1yYXRlLXRhc2tcIiwgdmlld01vZGVsLCB0ZW1wbGF0ZSk7XHJcbiAgICB9XHJcbn0iLCLvu79pbXBvcnQga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7IERhc2hib2FyZCB9IGZyb20gXCIuL2Rhc2hib2FyZC9kYXNoYm9hcmRcIjtcclxuaW1wb3J0IHsgRXhjaGFuZ2VSYXRlcyB9IGZyb20gXCIuL2V4Y2hhbmdlLXJhdGVzL2V4Y2hhbmdlLXJhdGVzXCI7XHJcbmltcG9ydCB7IEJldHRlckV4YW1wbGUgfSBmcm9tIFwiLi9iZXR0ZXItZXhhbXBsZS9iZXR0ZXItZXhhbXBsZVwiO1xyXG5pbXBvcnQgeyBSYXRlVGFzayB9IGZyb20gXCIuL3JhdGUtdGFzay9yYXRlLXRhc2tcIjtcclxuXHJcbmFjdGl2YXRlS25vY2tvdXRDb21wb25lbnRzKCk7XHJcblxyXG5cclxuZnVuY3Rpb24gYWN0aXZhdGVLbm9ja291dENvbXBvbmVudHMoKSB7XHJcbiAgICB2YXIgZGFzaCA9IG5ldyBEYXNoYm9hcmQoKTtcclxuICAgIHZhciBleGNoYW5nZVJhdGVzID0gbmV3IEV4Y2hhbmdlUmF0ZXMoKTtcclxuICAgIHZhciBiZXR0ZXJFeGFtcGxlID0gbmV3IEJldHRlckV4YW1wbGUoKTtcclxuICAgIHZhciByYXRlVGFzayA9IG5ldyBSYXRlVGFzaygpO1xyXG4gICAgXHJcbiAgICBrby5hcHBseUJpbmRpbmdzKCk7XHJcbn1cclxuXHJcbiJdLCJuYW1lcyI6WyJkZWZpbmUiLCJLbm9ja291dFNlcnZpY2UiLCJyZWdpc3RlckNvbXBvbmVudCIsIm5hbWUiLCJ2aWV3TW9kZWwiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudENvbmZpZyIsImNvbXBvbmVudHMiLCJyZWdpc3RlciIsIkRhc2hib2FyZCIsInNlbGYiLCJ0YXNrcyIsImtvIiwib2JzZXJ2YWJsZUFycmF5IiwiZ2V0VGFza3MiLCJwdXNoIiwiRXhjaGFuZ2VSYXRlcyIsInJhdGUiLCJvYnNlcnZhYmxlIiwiZ2V0RXhjaGFuZ2VSYXRlcyIsIkJldHRlckV4YW1wbGUiLCJjdXJyZW50RGF0ZVRpbWUiLCJEYXRlIiwiUmF0ZVRhc2siLCJhcHByb3ZlZCIsImFwcHJvdmVUYXNrIiwiZGlzYXBwcm92ZVRhc2siLCJhY3RpdmF0ZUtub2Nrb3V0Q29tcG9uZW50cyIsImRhc2giLCJleGNoYW5nZVJhdGVzIiwiYmV0dGVyRXhhbXBsZSIsInJhdGVUYXNrIiwiYXBwbHlCaW5kaW5ncyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFNQSxDQUFDLFVBQVU7QUFDWCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDZixDQUFDLFNBQVMsU0FBUyxDQUFDOzs7SUFHaEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUM7UUFDbEMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDN0IsU0FBUyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDL0IsY0FBYyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDakMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixDQUFDLFNBQVMsT0FBTyxFQUFFOztJQUVmLElBQUksT0FBT0EsU0FBTSxLQUFLLFVBQVUsSUFBSUEsU0FBTSxDQUFDLEtBQUssQ0FBQyxFQUFFOztRQUUvQ0EsU0FBTSxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFF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
