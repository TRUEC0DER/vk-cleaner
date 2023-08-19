const {question, deleteConversations} = require("./helpers");
const {configRead, configEdit} = require("./config");
const api = require("./api");

async function settingsScene(rl) {
    const useExistingDataAnswer = await question(rl, "\n[🔧] Использовать существующие данные из config.json? (Y - Да / N - Нет)\n[⚡️]  ")
    switch (true) {
        case /^(нет|no|н|n)/i.test(useExistingDataAnswer):
            await configScene(rl);
            await modeScene(rl);
            break;
        case /^(да|yes|д|y)/i.test(useExistingDataAnswer):
            await modeScene(rl);
            break;
        default:
            await settingsScene(rl);
            break;
    }
}

async function modeScene(rl) {
    const countAnswer = await question(rl, "\n[⚙️] Выберите режим работы\n(1) - Удаление заданного количества сообщений и прекращение работы скрипта\n(2) - Циклическое удаление заданного количества диалогов\n[⚡️]  ")
    const configConversationsDelete = configRead().conversations.delete
    if (!(/^(1|2)/ig.test(countAnswer))) {
        await modeScene(rl);
        return
    }
    await deleteConversations(
        configConversationsDelete.count,
        configConversationsDelete.parallelRequests,
        configConversationsDelete.delay.min,
        configConversationsDelete.delay.max,
        countAnswer === '2'
    );
}

async function configScene(rl) {
    const tokenAnswer = await question(rl, "\n[🔒] Введите токен от страницы ВКонтакте\n[⚡️]  ")
    await configEdit('token', tokenAnswer)
    api.options.token = tokenAnswer
    const countAnswer = await question(rl, "\n[📝] Введите количество диалогов, которые необходимо удалить\n(🍀) - По умолчанию: 1000\n[⚡️]  ")
    await configEdit('conversations.delete.count',
        isNaN(Number(countAnswer)) || !countAnswer
            ? 1000 : Number(countAnswer)
    )

    const parallelRequestsAnswer = await question(rl, "\n[🚀] Введите количество параллельных запросов\n(🍀) - По умолчанию: 10\n(🍀) - Максимальное значение: 25\n[⚡️]  ")
    await configEdit('conversations.delete.parallelRequests',
        isNaN(Number(parallelRequestsAnswer)) || !parallelRequestsAnswer || Number(parallelRequestsAnswer) > 25
            ? 10 : Number(parallelRequestsAnswer)
    )

    const minDelayAnswer = await question(rl, "\n[⏳] Введите минимальную задержку удаления одного диалога (В миллисекундах)\n(🍀) - По умолчанию: 500\n[⚡️]  ")
    await configEdit('conversations.delete.delay.min',
        isNaN(Number(minDelayAnswer)) || !minDelayAnswer
            ? 500 : Number(minDelayAnswer)
    )

    const maxDelayAnswer = await question(rl, "\n[⏳] Введите максимальную задержку удаления одного диалога (В миллисекундах)\n(🍀) - По умолчанию: 1000\n[⚡️]  ")
    await configEdit('conversations.delete.delay.max',
        isNaN(Number(maxDelayAnswer)) || !maxDelayAnswer
            ? 1000 : Number(maxDelayAnswer)
    )
}

module.exports = {
    settingsScene
}