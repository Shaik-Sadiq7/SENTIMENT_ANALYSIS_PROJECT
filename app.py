from flask import Flask, render_template, request
import pandas as pd
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
import string
import re

app = Flask(__name__)


# data = pd.read_csv("https://raw.githubusercontent.com/amankharwal/Website-data/master/twitter.csv")
data = pd.read_csv("C://Users//Dell//Downloads//TWITTER_SENTIMENT_PROJ//data1.csv")


nltk.download('stopwords')
stemmer = nltk.SnowballStemmer("english")
stopword = set(stopwords.words('english'))

def clean(text):
    text = str(text).lower()
    text = re.sub('\\[.*?\\]', '', text)
    text = re.sub('https?://\\S+|www\\.\\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    words = [word for word in text.split(' ') if word not in stopword]
    text = " ".join(words)
    stemmed_words = [stemmer.stem(word) for word in words]
    text = " ".join(stemmed_words)
    return text

# Apply cleaning to the 'tweet' column
data["tweet"] = data["tweet"].apply(clean)

# from nltk.sentiment.vader import SentimentIntensityAnalyzer
nltk.download('vader_lexicon')
sentiments = SentimentIntensityAnalyzer()
data["Positive"] = [sentiments.polarity_scores(i)["pos"] for i in data["tweet"]]
data["Negative"] = [sentiments.polarity_scores(i)["neg"] for i in data["tweet"]]
data["Neutral"] = [sentiments.polarity_scores(i)["neu"] for i in data["tweet"]]

data = data[["tweet", "Positive", "Negative", "Neutral"]]

@app.route('/')
def index():
    return render_template('home.html')  

@app.route('/sentiment')
def sentiment():
    return render_template('sentiment.html', result=None, active_page='sentiment')

@app.route('/analyze', methods=['POST'])
def analyze():
    text = request.form['text']
    cleaned_text = clean(text)

    pos = sentiments.polarity_scores(cleaned_text)["pos"]
    neg = sentiments.polarity_scores(cleaned_text)["neg"]
    neu = sentiments.polarity_scores(cleaned_text)["neu"]

    result = {
        'positive': pos,
        'negative': neg,
        'neutral': neu,
    }

    return render_template('sentiment.html', result=result, text=text, active_page='sentiment')

def get_sentiment_score(a, b, c):
    if a > b and a > c:
        return "Positive 😊"
    elif b > a and b > c:
        return "Negative 😠"
    else:
        return "Neutral 🙂"

if __name__ == '__main__':
    app.run(debug=True)
