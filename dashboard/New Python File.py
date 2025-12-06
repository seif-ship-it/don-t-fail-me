import streamlit as st
import pandas as pd
import numpy as np
import time
from sklearn.linear_model import LinearRegression

st.set_page_config(layout="wide")
st.title("Simple Real-Time AI Dashboard Prototype 📈")

# Create a container to hold the live data, allowing it to refresh
placeholder = st.empty()

# Function to simulate real-time data and generate a forecast
def generate_realtime_data():
    # 1. Simulate "Live" Data
    # Get the current time in seconds to act as the X-axis for the model
    current_timestamp = time.time()
    
    # Generate 50 points of synthetic data over the last hour (3600 seconds)
    timestamps = np.linspace(current_timestamp - 3600, current_timestamp, 50)
    
    # Generate Y-data (e.g., Website Visitors) with a slight upward trend and noise
    visitors = (timestamps - timestamps[0]) / 100 + np.random.normal(0, 5, 50) + 100
    
    df = pd.DataFrame({
        'Timestamp': timestamps,
        'Visitors': visitors.round(0)
    })
    
    # 2. Build the Simple AI Model (Linear Regression Forecast)
    # Use the last 50 data points to train the model
    X = df[['Timestamp']]
    y = df['Visitors']
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict the next 10 data points (e.g., 5 minutes into the future)
    future_timestamps = np.linspace(current_timestamp + 60, current_timestamp + 300, 10).reshape(-1, 1)
    future_predictions = model.predict(future_timestamps)
    
    forecast_df = pd.DataFrame({
        'Timestamp': future_timestamps.flatten(),
        'Visitors': future_predictions.round(0),
        'Type': 'Forecast'
    })
    
    # Combine actual and forecast data for charting
    df['Type'] = 'Actual'
    full_df = pd.concat([df, forecast_df])
    
    return full_df, df['Visitors'].iloc[-1] # Return all data and the last actual visitor count

# Main loop to simulate real-time updates
while True:
    full_data, latest_visitors = generate_realtime_data()
    
    with placeholder.container():
        
        # 3. Display the Real-Time KPI (Metric Card)
        kpi_col, chart_col = st.columns([1, 3])
        
        with kpi_col:
            st.metric(
                label="LIVE VISITORS (Last 5 min avg)", 
                value=f"{latest_visitors:.0f}", 
                delta="Simple Forecast Included" # Placeholder for a calculated delta
            )
            st.markdown(f"**Current System Time:** {pd.to_datetime(time.time(), unit='s').strftime('%H:%M:%S')}")

        # 4. Display the Chart with Forecast
        with chart_col:
            st.subheader("Visitor Activity & Simple Linear Forecast")
            
            # Use Streamlit's line chart for simplicity, showing both actual and forecast
            st.line_chart(
                data=full_data, 
                x='Timestamp', 
                y='Visitors', 
                color='Type' 
            )

        # 5. Add a simple data table (for debug/detail)
        st.subheader("Recent Data Table")
        st.dataframe(full_data.tail(10))

    # Wait for 3 seconds before rerunning the data simulation loop
    time.sleep(3)