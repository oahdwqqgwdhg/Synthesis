import * as $protobuf from "protobufjs";
import Long = require("long");

/**
 * Properties of a PlayerAction.
 * @deprecated Use PlayerAction.$Properties instead.
 */
export interface IPlayerAction extends PlayerAction.$Properties {
}

/** Represents a PlayerAction. */
export class PlayerAction {

    /**
     * Constructs a new PlayerAction.
     * @param [properties] Properties to set
     */
    constructor(properties?: PlayerAction.$Properties);

    /** Unknown fields preserved while decoding when enabled */
    $unknowns?: Uint8Array[];

    /** PlayerAction playerId. */
    playerId: string;

    /** PlayerAction action. */
    action: string;

    /** PlayerAction score. */
    score: number;

    /** PlayerAction x. */
    x: number;

    /**
     * Creates a new PlayerAction instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PlayerAction instance
     */
    static create(properties: PlayerAction.$Shape): PlayerAction & PlayerAction.$Shape;
    static create(properties?: PlayerAction.$Properties): PlayerAction;

    /**
     * Encodes the specified PlayerAction message. Does not implicitly {@link PlayerAction.verify|verify} messages.
     * @param message PlayerAction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encode(message: PlayerAction.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PlayerAction message, length delimited. Does not implicitly {@link PlayerAction.verify|verify} messages.
     * @param message PlayerAction message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    static encodeDelimited(message: PlayerAction.$Properties, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PlayerAction message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns {PlayerAction & PlayerAction.$Shape} PlayerAction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PlayerAction & PlayerAction.$Shape;

    /**
     * Decodes a PlayerAction message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns {PlayerAction & PlayerAction.$Shape} PlayerAction
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PlayerAction & PlayerAction.$Shape;

    /**
     * Verifies a PlayerAction message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PlayerAction message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PlayerAction
     */
    static fromObject(object: { [k: string]: any }): PlayerAction;

    /**
     * Creates a plain object from a PlayerAction message. Also converts values to other types if specified.
     * @param message PlayerAction
     * @param [options] Conversion options
     * @returns Plain object
     */
    static toObject(message: PlayerAction, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PlayerAction to JSON.
     * @returns JSON object
     */
    toJSON(): { [k: string]: any };

    /**
     * Gets the type url for PlayerAction
     * @param [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
     * @returns The type url
     */
    static getTypeUrl(prefix?: string): string;
}

export namespace PlayerAction {

    /** Properties of a PlayerAction. */
    interface $Properties {

        /** PlayerAction playerId */
        playerId?: (string|null);

        /** PlayerAction action */
        action?: (string|null);

        /** PlayerAction score */
        score?: (number|null);

        /** PlayerAction x */
        x?: (number|null);

        /** Unknown fields preserved while decoding when enabled */
        $unknowns?: Uint8Array[];
    }

    /** Shape of a PlayerAction. */
    type $Shape = PlayerAction.$Properties;
}
