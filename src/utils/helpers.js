const {createCollectIterator} = require("vk-io");

const api = require("./api");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomInt(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function question(rl, prompt) {
    return new Promise((resolve, reject) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
}

async function deleteConversationsHelper(count, parallelRequests, minDelay, maxDelay) {
    const iterator = createCollectIterator({
        api,
        method: 'messages.getConversations',
        countPerRequest: count <= 200 ? count : 200,
        parallelRequests: parallelRequests,
        maxCount: count
    });

    console.log(`\n[📜] Получение списка диалогов...`)

    for await (const chunk of iterator) {
        const conversationsList = chunk.items.map(el => el.conversation.peer.id)
        console.log(`\n[❗] Запускаю удаление диалогов с заданными параметрами\n[📝] Количество диалогов: ${count}\n[🚀] Количество параллельных запросов: ${parallelRequests}\n[⏳] Минимальная задержка удаления: ${minDelay}\n[⏳] Максимальная задержка удаления: ${maxDelay}\n`)
        for (let conversation in conversationsList) {
            try {
                await api.messages.deleteConversation({
                    [(/^-/.test(conversation) || conversation.startsWith("2000000")) ? 'peer_id' : 'user_id']: conversationsList[conversation]
                })
                console.log(`[🗑️] [${Number(conversation) + 1}/${count}] Удалено: ${conversationsList[conversation]}`)
                await sleep(randomInt(minDelay, maxDelay))
            } catch (error) {
                console.log(`[❌] [${Number(conversation) + 1}/${count}] Ошибка при удалении диалога ${conversationsList[conversation]}: `, error.message)
                console.log(`[🔄] Продолжение выполнения...`)
            }
        }
    }
    console.log(`[✅] ${count} диалогов было удалено`)
}

async function deleteConversations(count, parallelRequests, minDelay, maxDelay, isCycle) {
    if (isCycle) {
        while (true) {
            await deleteConversationsHelper(count, parallelRequests, minDelay, maxDelay);
        }
    } else {
        await deleteConversationsHelper(count, parallelRequests, minDelay, maxDelay);
    }
}

module.exports = {
    question,
    deleteConversations
};