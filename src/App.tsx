import WeatherCard from "./components/WeatherCard";
import MapWithWeather from "./components/MapWithWeather";
import "./App.css";

function App() {
  return (
    <div className="app">
      
     
      <header className="app-header">
        <div className="header-content">
          <h1>🌤 Weather App</h1>
          <p>Real-time weather + location based insights</p>
        </div>
      </header>

   
      <main className="app-main">
        <div className="container">
          <div className="content-grid">

            
            <section className="card-section">
              <div className="card">
                <WeatherCard />
              </div>
            </section>

           
            <section className="card-section">
              <div className="card">
                <h2>Your Location</h2>
                <MapWithWeather />
              </div>
            </section>

          </div>
        </div>
      </main>

      
      <footer className="app-footer">
        <p>© 2026 Weather App • OpenWeather API</p>
      </footer>

    </div>
  );
}

export default App;