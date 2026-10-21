export const GameEvent = {

    SPAWN_START:'spawn_start',
    SPAWN_END:'spawn_end',

    CLICK_INHIBIT:'click_inhibit',
    CLICK_START:'click_start',

    AUDIO_INHIBIT:'spqwn_audio_inhibit',
    AUDIO_START:'spawn_audio_start',

    GAME_OVER:'game_over',
    GAMERE_RESTART:'game_restart',

    SCORE_CHANGED:'score_changed',

}as const;

export type GameEventKey =typeof GameEvent[keyof typeof GameEvent];

