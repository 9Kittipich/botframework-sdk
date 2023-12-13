// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory, CardFactory, TurnContext } = require('botbuilder');

class EchoBot extends ActivityHandler {
    constructor(conversationReferences) {
        super();

        // Dependency injected dictionary for storing ConversationReference objects used in NotifyController to proactively message users
        this.conversationReferences = conversationReferences;

        this.onConversationUpdate(async (context, next) => {
            this.addConversationReference(context.activity);
            await next();
        });

        this.onMessage(async (context, next) => {
            this.addConversationReference(context.activity);
            if (context.activity.value) {
                const selectedOption = context.activity.value;
                if (selectedOption === 'Option 1') {
                    const responseText = 'คำขอย้ายสหกรณ์ของคุณ อยู่ในการดำเนินการเข้าที่ประชุม';
                    await context.sendActivity(MessageFactory.text(responseText));
                } else if (selectedOption === 'Option 2') {
                    const responseText = 'ยอดค้างชำระงวดที่ 12 ของคุณ 1,400.00 บาท';
                    await context.sendActivity(MessageFactory.text(responseText));
                } else if (selectedOption === 'Option 3') {
                    const responseText = 'สัญญาของคุณมีอยู่ทั้งหมด 3 สัญญา';
                    await context.sendActivity(MessageFactory.text(responseText));
                }
            } else {
                await next();
            }
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    const suggestedActions = CardFactory.thumbnailCard(
                        'ยินดีต้อนรับ!',
                        'ท่านสามารถสอบถามธุรกรรมที่ท่านต้องการได้ค่ะ',
                        ['https://phetchaburi.cad.go.th/images/gallery/1/%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%81%E0%B8%A3%E0%B8%A1%E0%B8%AF.gif'],
                        [
                            {
                                type: 'messageBack',
                                title: 'ตรวจสอบคำขอ',
                                value: 'Option 1'
                            },
                            {
                                type: 'messageBack',
                                title: 'ตรวจสอบยอดค้างชำระ',
                                value: 'Option 2'
                            },
                            {
                                type: 'messageBack',
                                title: 'ตรวจสอบสัญญาทั้งหมด',
                                value: 'Option 3'
                            }
                        ]
                    );
                    const reply = MessageFactory.attachment(suggestedActions);
                    await context.sendActivity(reply);
                }
            }
            await next();
        });
    }

    addConversationReference(activity) {
        const conversationReference = TurnContext.getConversationReference(activity);
        this.conversationReferences[conversationReference.conversation.id] = conversationReference;
    }

    withdraw() {
        return CardFactory.receiptCard({
            title: 'รายการเงินออก',
            facts: [
                { key: 'สถานะ', value: 'ถอนเงินสำเร็จ' },
                { key: 'วันที่', value: '13 ธ.ค. 66' }
            ],
            items: [
                {
                    title: 'นายกิตติพิชญ์ เสนานุช',
                    subtitle: 'บัญชีสหกรณ์ออมทรัพย์โรงพยาบาลศรีษเกษ',
                    text: 'xxx-x-x1234-x',
                    image: { url: 'https://api.iconify.design/mdi/bank.svg', alt: 'Bank Transfer Out' }
                },
                {
                    image: { url: 'https://api.iconify.design/mdi/arrow-down.svg', alt: 'Bank swap' }
                },
                {
                    title: 'นายกิตติพิชญ์ เสนานุช',
                    subtitle: 'บัญชีธนาคารกรุงไทย',
                    text: 'xxx-x-x1234-x',
                    image: { url: 'https://api.iconify.design/mdi/bank.svg', alt: 'Bank Transfer Out' }
                }
            ],
            total: '20000.00 บาท'
        });
    }

    deposit() {
        return CardFactory.receiptCard({
            title: 'รายการเงินเข้า',
            facts: [
                { key: 'สถานะ', value: 'ฝากเงินสำเร็จ' },
                { key: 'วันที่', value: '13 ธ.ค. 66' }
            ],
            items: [
                {
                    title: 'เงินสด',
                    subtitle: '10000.00 บาท',
                    // text: '1000.00 บาท',
                    image: { url: 'https://api.iconify.design/mdi/cash.svg', alt: 'Bank Transfer In' }
                },
                {
                    image: { url: 'https://api.iconify.design/mdi/arrow-down.svg', alt: 'Bank swap' }
                },
                {
                    title: 'นายกิตติพิชญ์ เสนานุช',
                    subtitle: 'บัญชีสหกรณ์ออมทรัพย์โรงพยาบาลศรีษเกษ',
                    text: 'xxx-x-x1234-x',
                    image: { url: 'https://api.iconify.design/mdi/bank.svg', alt: 'Bank Transfer Out' }
                }
            ]
        });
    }
}

module.exports.EchoBot = EchoBot;
