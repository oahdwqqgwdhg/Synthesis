/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
var $Object = $util.global.Object, $undefined = $util.global.undefined, $Error = $util.global.Error, $RangeError = $util.global.RangeError, $TypeError = $util.global.TypeError, $String = $util.global.String, $Number = $util.global.Number, $isFinite = $util.global.isFinite;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.PlayerAction = (function() {

    /**
     * Properties of a PlayerAction.
     * @typedef {Object} PlayerAction.$Properties
     * @property {string|null} [playerId] PlayerAction playerId
     * @property {string|null} [action] PlayerAction action
     * @property {number|null} [score] PlayerAction score
     * @property {number|null} [x] PlayerAction x
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
     */

    /**
     * Properties of a PlayerAction.
     * @exports IPlayerAction
     * @interface IPlayerAction
     * @augments PlayerAction.$Properties
     * @deprecated Use PlayerAction.$Properties instead.
     */

    /**
     * Shape of a PlayerAction.
     * @typedef {PlayerAction.$Properties} PlayerAction.$Shape
     */

    /**
     * Constructs a new PlayerAction.
     * @exports PlayerAction
     * @classdesc Represents a PlayerAction.
     * @constructor
     * @param {PlayerAction.$Properties=} [properties] Properties to set
     * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
     */
    var PlayerAction = function (properties) {
        if (properties)
            for (var keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
    };

    /**
     * PlayerAction playerId.
     * @member {string} playerId
     * @memberof PlayerAction
     * @instance
     */
    PlayerAction.prototype.playerId = "";

    /**
     * PlayerAction action.
     * @member {string} action
     * @memberof PlayerAction
     * @instance
     */
    PlayerAction.prototype.action = "";

    /**
     * PlayerAction score.
     * @member {number} score
     * @memberof PlayerAction
     * @instance
     */
    PlayerAction.prototype.score = 0;

    /**
     * PlayerAction x.
     * @member {number} x
     * @memberof PlayerAction
     * @instance
     */
    PlayerAction.prototype.x = 0;

    /**
     * Creates a new PlayerAction instance using the specified properties.
     * @function create
     * @memberof PlayerAction
     * @static
     * @param {PlayerAction.$Properties=} [properties] Properties to set
     * @returns {PlayerAction} PlayerAction instance
     * @type {{
     *   (properties: PlayerAction.$Shape): PlayerAction & PlayerAction.$Shape;
     *   (properties?: PlayerAction.$Properties): PlayerAction;
     * }}
     */
    PlayerAction.create = function(properties) {
        return new PlayerAction(properties);
    };

    /**
     * Encodes the specified PlayerAction message. Does not implicitly {@link PlayerAction.verify|verify} messages.
     * @function encode
     * @memberof PlayerAction
     * @static
     * @param {PlayerAction.$Properties} message PlayerAction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PlayerAction.encode = function (message, writer, _depth) {
        if (!writer)
            writer = $Writer.create();
        if (_depth === $undefined)
            _depth = 0;
        if (_depth > $util.recursionLimit)
            throw $Error("max depth exceeded");
        if (message.playerId != null && $Object.hasOwnProperty.call(message, "playerId") && message.playerId !== "")
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.playerId);
        if (message.action != null && $Object.hasOwnProperty.call(message, "action") && message.action !== "")
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.action);
        if (message.score != null && $Object.hasOwnProperty.call(message, "score") && message.score !== 0)
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.score);
        if (message.x != null && $Object.hasOwnProperty.call(message, "x") && !$Object.is(message.x, 0))
            writer.uint32(/* id 4, wireType 5 =*/37).float(message.x);
        if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
                writer.raw(message.$unknowns[i]);
        return writer;
    };

    /**
     * Encodes the specified PlayerAction message, length delimited. Does not implicitly {@link PlayerAction.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PlayerAction
     * @static
     * @param {PlayerAction.$Properties} message PlayerAction message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PlayerAction.encodeDelimited = function(message, writer) {
        return this.encode(message, (writer || $Writer.create()).fork()).ldelim();
    };

    /**
     * Decodes a PlayerAction message from the specified reader or buffer.
     * @function decode
     * @memberof PlayerAction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PlayerAction & PlayerAction.$Shape} PlayerAction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PlayerAction.decode = function (reader, length, _end, _depth, _target) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        if (_depth === $undefined)
            _depth = 0;
        if (_depth > $Reader.recursionLimit)
            throw $Error("max depth exceeded");
        var end, message, value;
        if (length === $undefined)
            end = reader.len;
        else {
            end = reader.pos + length;
            if (end > reader.len)
                throw $RangeError("index out of range");
            length = reader.len;
            reader.len = end;
        }
        message = _target || new $root.PlayerAction();
        while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
                _end = $undefined;
                break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
            case 1: {
                    if (wireType !== 2)
                        break;
                    if ((value = reader.stringVerify()).length)
                        message.playerId = value;
                    else
                        delete message.playerId;
                    continue;
                }
            case 2: {
                    if (wireType !== 2)
                        break;
                    if ((value = reader.stringVerify()).length)
                        message.action = value;
                    else
                        delete message.action;
                    continue;
                }
            case 3: {
                    if (wireType !== 0)
                        break;
                    if (value = reader.int32())
                        message.score = value;
                    else
                        delete message.score;
                    continue;
                }
            case 4: {
                    if (wireType !== 5)
                        break;
                    if (!$Object.is(value = reader.float(), 0))
                        message.x = value;
                    else
                        delete message.x;
                    continue;
                }
            }
            reader.skipType(wireType, _depth, tag);
            if (!reader.discardUnknown) {
                $util.makeProp(message, "$unknowns", false);
                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
            }
        }
        if (length !== $undefined) {
            if (reader.pos !== end)
                throw $RangeError("index out of range");
            reader.len = length;
        }
        if (_end !== $undefined)
            throw $Error("missing end group");
        return message;
    };

    /**
     * Decodes a PlayerAction message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PlayerAction
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PlayerAction & PlayerAction.$Shape} PlayerAction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PlayerAction.decodeDelimited = function(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.size());
    };

    /**
     * Verifies a PlayerAction message.
     * @function verify
     * @memberof PlayerAction
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PlayerAction.verify = function (message, _depth) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (_depth === $undefined)
            _depth = 0;
        if (_depth > $util.recursionLimit)
            return "max depth exceeded";
        if (message.playerId != null && $Object.hasOwnProperty.call(message, "playerId"))
            if (!$util.isString(message.playerId))
                return "playerId: string expected";
        if (message.action != null && $Object.hasOwnProperty.call(message, "action"))
            if (!$util.isString(message.action))
                return "action: string expected";
        if (message.score != null && $Object.hasOwnProperty.call(message, "score"))
            if (!$util.isInteger(message.score))
                return "score: integer expected";
        if (message.x != null && $Object.hasOwnProperty.call(message, "x"))
            if (typeof message.x !== "number")
                return "x: number expected";
        return null;
    };

    /**
     * Creates a PlayerAction message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PlayerAction
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PlayerAction} PlayerAction
     */
    PlayerAction.fromObject = function (object, _depth) {
        if (object instanceof $root.PlayerAction)
            return object;
        if (!$util.isObject(object))
            throw $TypeError(".PlayerAction: object expected");
        if (_depth === $undefined)
            _depth = 0;
        if (_depth > $util.recursionLimit)
            throw $Error("max depth exceeded");
        var message = new $root.PlayerAction();
        if (object.playerId != null)
            if (typeof object.playerId !== "string" || object.playerId.length)
                message.playerId = $String(object.playerId);
        if (object.action != null)
            if (typeof object.action !== "string" || object.action.length)
                message.action = $String(object.action);
        if (object.score != null)
            if ($Number(object.score) !== 0)
                message.score = object.score | 0;
        if (object.x != null)
            if (!$Object.is($Number(object.x), 0))
                message.x = $Number(object.x);
        return message;
    };

    /**
     * Creates a plain object from a PlayerAction message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PlayerAction
     * @static
     * @param {PlayerAction} message PlayerAction
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PlayerAction.toObject = function (message, options, _depth) {
        if (!options)
            options = {};
        if (_depth === $undefined)
            _depth = 0;
        if (_depth > $util.recursionLimit)
            throw $Error("max depth exceeded");
        var object = {};
        if (options.defaults) {
            object.playerId = "";
            object.action = "";
            object.score = 0;
            object.x = 0;
        }
        if (message.playerId != null && $Object.hasOwnProperty.call(message, "playerId"))
            object.playerId = message.playerId;
        if (message.action != null && $Object.hasOwnProperty.call(message, "action"))
            object.action = message.action;
        if (message.score != null && $Object.hasOwnProperty.call(message, "score"))
            object.score = message.score;
        if (message.x != null && $Object.hasOwnProperty.call(message, "x"))
            object.x = options.json && !$isFinite(message.x) ? $String(message.x) : message.x;
        return object;
    };

    /**
     * Converts this PlayerAction to JSON.
     * @function toJSON
     * @memberof PlayerAction
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PlayerAction.prototype.toJSON = function() {
        return PlayerAction.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the type url for PlayerAction
     * @function getTypeUrl
     * @memberof PlayerAction
     * @static
     * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns {string} The type url
     */
    PlayerAction.getTypeUrl = function(prefix) {
        if (prefix === $undefined)
            prefix = "type.googleapis.com";
        return prefix + "/PlayerAction";
    };

    return PlayerAction;
})();

module.exports = $root;
