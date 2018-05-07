export const LoginPlayMode = {
    initialState: {
        currentStep: 0,
    },
    started() {
        this.logger.debug(`received connection on ${this.metadata.remoteAddress}'`);
    },
};
