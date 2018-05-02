const TelnetService = jest.fn();

TelnetService.mockReturnValue({schema: true});

module.exports = TelnetService;
