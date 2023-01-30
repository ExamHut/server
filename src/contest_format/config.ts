type ContestConfig = {
    cumtime?: boolean,
    last_score_altering?: boolean,
    first_ac_bonus?: number,
    time_bonus?: number,
    penalty?: number,
}

type ContestConfigValidator = {
    cumtime?: Function,
    first_ac_bonus?: Function,
    time_bonus?: Function,
    penalty?: Function,
}

type FormatData = {
    [key: string]: any
}
