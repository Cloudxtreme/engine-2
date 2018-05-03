export interface IBrokerConfig {
    redis: string;
    created?: Function;
    stopped?: Function;
    started?: Function;
}
