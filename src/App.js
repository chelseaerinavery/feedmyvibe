import "./App.css";
import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_SECRET,
});
const openai = new OpenAIApi(configuration);

function App() {
  const [moodInput, setMoodInput] = useState("");
  const [results, setResults] = useState([]);
  const [fetching, setFetching] = useState(false);

  function generatePrompt(mood) {
    const capitalizedMood = mood[0].toUpperCase() + mood.slice(1).toLowerCase();
    return `Suggest a meal given a mood.
  
  Mood: Sad
  Recipe: Need comfort? Try ice cream: Stir 3/4 c white sugar, 1 c heavy whipping cream, and 2 1/4 c milk into a saucepan over low heat until sugar has dissolved. Transfer cream mixture to a pourable container such as a large measuring cup. Stir in 2 tsp vanilla extract and chill mix thoroughly, at least 2 hours. (Overnight is best.) Pour cold ice cream mix into an ice cream maker, turn on the machine, and churn according to manufacturer's directions, 20 to 25 minutes. When ice cream is softly frozen, serve immediately or place a piece of plastic wrap directly on the ice cream and place in freezer to ripen, 2 to 3 hours.
  Mood: Happy
  Recipe: Tacos are happy: Cook beef or plant-based beef in 10-inch skillet over medium heat 8 to 10 minutes, stirring occasionally, until brown; drain. Stir salsa into beef. Heat to boiling, stirring constantly; reduce heat to medium-low. Cook 5 minutes, stirring occasionally. Pour beef mixture into large serving bowl.Heat taco shells as directed on package. Serve taco shells with beef mixture, lettuce, tomato and cheese.
  Mood: Anxious
  Recipe: Anxious? Try some kava tea. Add 1 c of kava root powder and 2 c of water to a large bowl. Allow the powder to soak in the water for 20-30 minutes. Thereafter, pour the mixture through a fine cheesecloth, catching the root powder. Squeeze and press the remaining powder in the cheesecloth, removing as much liquid as possible.
  Mood: Depressed
  Recipe: When you're depressed try chicken soup to soothe the soul. Melt 1 tbsp butter in a large pot over medium heat. Add 1/2 c onion and 1/2 c celery and cook until just tender, about 5 minutes. Add about 50 oz of chicken broth, 14.5 oz of vegetable broth, 1/2 lb chopped and cooked chicken breast, 1 1/2c egg noodles, 1c sliced carrots, 1/2 tsp basil, 1/2 tsp oregano, salt, and pepper. Stir to combine and bring to a boil. Reduce heat and simmer for 20 minutes.
  Mood: ${capitalizedMood}
  Recipe:`;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setFetching(true);

    try {
      const completion = await openai.createCompletion("text-davinci-002", {
        prompt: generatePrompt(moodInput),
        temperature: 0.6,
        max_tokens: 256,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      const response = {
        text: completion.data.choices[0].text,
        prompt: moodInput[0].toUpperCase() + moodInput.slice(1).toLowerCase(),
      };

      setResults((prevArray) => [response, ...prevArray]);
      setMoodInput("");
      setFetching(false);
    } catch (e) {
      alert(e, "big error");
      setFetching(false);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chelsea's Shopify Technical Project</h1>
        <h2>Exploring AI</h2>
      </header>
      <div className="Input">
        <form onSubmit={onSubmit}>
          <label>
            <h3>🥧🍦🍩 What's your mood? 🥞🍕🍜</h3>
            <input
              type="text"
              name="input"
              placeholder="Type your mood."
              value={moodInput}
              onChange={(e) => setMoodInput(e.target.value)}
            />
          </label>
          <input
            className="submit"
            disabled={!moodInput}
            type="submit"
            value="Feed My Vibe"
          />
        </form>
      </div>

      {!fetching &&
        results.map((result) => {
          return (
            <div className="result">
              <p>
                <b>Prompt:</b> {result.prompt}
              </p>{" "}
              <p>
                <b>Result:</b> {result.text}
              </p>
            </div>
          );
        })}
      {fetching && <div className="result">loading...</div>}
    </div>
  );
}

export default App;
