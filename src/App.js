import React, { useEffect, useState } from 'react';
import './App.css';
import Select from 'react-select';

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
      document.title = "21BAI1676";
    }, []);

    const handleInputChange = (e) => {
        setJsonInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResponseData(null);

        try {
            const parsedData = JSON.parse(jsonInput);

            if (!Array.isArray(parsedData.data)) {
                throw new Error("Invalid JSON structure. 'data' should be an array.");
            }

            const response = await fetch('http://localhost:5000/bfhl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonInput,
            });

            const result = await response.json();
            setResponseData(result);

        } catch (err) {
            setError(`Invalid JSON: ${err.message}`);
        }
    };

    const handleOptionChange = (selected) => {
        setSelectedOptions(selected || []);
    };

    const renderFilteredResponse = () => {
        if (!responseData) return null;

        let filteredResponse = {};

        selectedOptions.forEach(option => {
            if (option.value === 'Alphabets') {
                filteredResponse.alphabets = responseData.alphabets;
            } else if (option.value === 'Numbers') {
                filteredResponse.numbers = responseData.numbers;
            } else if (option.value === 'Highest lowercase alphabet') {
                filteredResponse.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;
            }
        });

        return (
            <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
        );
    };

    const options = [
        { value: 'Alphabets', label: 'Alphabets' },
        { value: 'Numbers', label: 'Numbers' },
        { value: 'Highest lowercase alphabet', label: 'Highest lowercase alphabet' }
    ];

    return (
        <div className="App">
            <h1>BFHL API Frontend</h1>
            <form onSubmit={handleSubmit}>
                <h2>API Input:</h2>
                <label>
                    
                    <textarea
                        value={jsonInput}
                        onChange={handleInputChange}
                        rows="5"
                        cols="50"
                        placeholder='{ "data": ["A", "C", "z"] }'
                    />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {responseData && (
                <div className='Box'>
                    <h2>Response</h2>
                    <Select
                        isMulti
                        name="options"
                        options={options}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleOptionChange}
                    />
                    {renderFilteredResponse()}
                </div>
            )}
        </div>
    );
}

export default App;
