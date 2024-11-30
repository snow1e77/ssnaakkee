from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

TOKEN = "8136222979:AAG7Y2m9LJ9O3h3JiZiswuVqolFa1Cw66dk"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [
            InlineKeyboardButton(
                text="Играть в змейку 🐍",
                web_app=WebAppInfo(url="https://ssnaakkee.vercel.app/")
            )
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Привет! Нажми на кнопку, чтобы начать игру:", reply_markup=reply_markup)

def main():
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.run_polling()

if __name__ == "__main__":
    main()
