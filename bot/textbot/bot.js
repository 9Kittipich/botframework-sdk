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
            if (context.activity.text === '.') {
                const openOTP = EchoBot.openOTP();
                await context.sendActivity(MessageFactory.attachment(openOTP));
            } else if (context.activity.value) {
                const selectedOption = context.activity.value;

                if (selectedOption === 'Option 1') {
                    const responseText = 'คำขอย้ายสหกรณ์ของคุณ อยู่ในการดำเนินการเข้าที่ประชุม';
                    await context.sendActivity(MessageFactory.text(responseText));
                } else if (selectedOption === 'Option 2') {
                    const responseText = 'ยอดค้างชำระงวดที่ 12 ของคุณ 1,400.00 บาท';
                    await context.sendActivity(MessageFactory.text(responseText));
                } else if (selectedOption === 'Option 3') {
                    const openlink = CardFactory.heroCard(
                        'กู้สามัญ',
                        'กรอกข้อมูลแบบฟอร์มการขอกู้สามัญ',
                        null,
                        [
                            {
                                type: 'openUrl',
                                title: 'กรอกข้อมูล',
                                value: 'http://localhost:3000/appmember/prototype/loancheckapp'
                            }
                        ]
                    );
                    // const openOTP = CardFactory.heroCard(
                    //     'คุณกรอกแบบฟอร์มสำเร็จเเล้ว!!!',
                    //     'ขั้นตอนต่อไป: กรุณาติดต่อเจ้าหน้าที่เพื่อปริ้นเอกสาร',
                    //     null,
                    //     [
                    //         {
                    //             type: 'openUrl',
                    //             title: 'รับรหัส OTP',
                    //             value: 'http://localhost:3000/appmember/OTP1'
                    //         }
                    //     ]
                    // );

                    await context.sendActivity(MessageFactory.attachment(openlink));
                    // await context.sendActivity(MessageFactory.attachment(openOTP));
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
                        ['https://www.saving-sskh.com/images/logo-saving.png'],
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
                                title: 'ขอกู้สามัญ',
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

    static openOTP() {
        return CardFactory.heroCard(
            'เตรียมคำขอกู้สามัญเรียบร้อยเเล้ว!!!',
            'ขั้นตอนต่อไป: กรุณาติดต่อเจ้าหน้าที่เพื่อปริ้นเอกสาร กดปุ่มด้านล่างเมื่อถึงสำนักงานสหกรณ์ เพื่อติดต่อเจ้าหน้าที่',
            null,
            [
                {
                    type: 'openUrl',
                    title: 'รับบริการ',
                    value: 'http://localhost:3000/appmember/OTP1'
                }
            ]
        );
    }
}

module.exports.EchoBot = EchoBot;
