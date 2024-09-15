import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import './App.css';

// Define types for the data we expect to receive from the API
interface Phonetic {
  text: string;
  audio?: string;
}

interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface DictionaryEntry {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
}

// Define the Dictionary component
const App: React.FC = () => {
  const [word, setWord] = useState<string>('');
  const [result, setResult] = useState<DictionaryEntry | null>(null);
  const [error, setError] = useState<string>('');

  // Function to handle the search for a word
  const handleSearch = async () => {
    setError('');
    setResult(null);

    // Check if the word is empty
    if (word.trim() === '') {
      setError('Please enter a word');
      return;
    }

    // Fetch the data from the API
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (response.ok) {
        const data: DictionaryEntry[] = await response.json();
        setResult(data[0]);
      } else {
        setError('This word is not available');
      }
    } catch (err) {
      setError('An error occurred while fetching the data');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Dictionary</h2>
      <h3>Search the word you are looking for</h3>
      
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Search for a word..."
        style={{ padding: '10px', width: '30%', borderRadius: '5px' }}
        data-testid="search-input"  
      />
      <button onClick={handleSearch} style={{ padding: '10px 20px', borderRadius: '5px' }} data-testid="search-button">
        <FaSearch size={12} />
      </button>
      <button style={{ padding: '10px 20px', marginLeft: "10px", backgroundColor: '#C560FF' }} data-testid="save-button">
        Save
      </button>

      {error && <p style={{ color: 'red', marginTop: '20px' }} data-testid="error-message">{error}</p>}

      {result && (
        <div style={{ marginTop: '20px' }} data-testid="result-container">
          <h3 data-testid="word-display">Word: {result.word}</h3>
          {result.phonetics.length > 0 && (
            <div>
              <p data-testid="phonetic-display">Phonetic: {result.phonetics[0].text}</p>
              {result.phonetics[0].audio && (
                <audio controls>
                  <source src={result.phonetics[0].audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}
          {result.meanings.map((meaning, index) => (
            <div key={index} style={{ marginTop: '20px' }}>
              <h4>Part of Speech: {meaning.partOfSpeech}</h4>
              {meaning.definitions.map((def, defIndex) => (
                <div key={defIndex} style={{ marginBottom: '10px' }}>
                  <p data-testid="definition-display">Definition: {def.definition}</p>
                  {def.example && <p data-testid="example-display"><i>Example: {def.example}</i></p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
