import { useState } from 'react';

const usePrediction = (productId) => {
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPrediction = async () => {
    setIsLoading(true);
    setError('');
    
    const bodyPayload = {
      token: localStorage.getItem('token'),
      Dataset: {},
      start_date: "2019-01-01",
      end_date: "2019-12-31",
      product_name: "Car Speaker",
      discount: 0.1,
      price: 4500,
      market_demand: {
        market_share: {
          own: 0.25,
          competitor: [
            { name: "Pioneer", share: 0.2 },
            { name: "Sony", share: 0.18 },
            { name: "Blaupunkt", share: 0.1 },
            { name: "Others", share: 0.27 }
          ]
        },
        product_demand: {
          "2018": [12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 22000, 24000, 25000],
          "2019": [26000, 27000, 28000, 29000, 30000, 31000, 32000, 33000, 35000, 38000, 40000, 42000]
        }
      },
      promotion: {
        Competitor_promotion_effect: {
          "JBL": 0.15,
          "Pioneer": 0.12,
          "Sony": 0.1
        },
        Old_promotion: [
          { datetime: "2018-03-10", type: "New_Product_Launch_Offer" },
          { datetime: "2018-08-15", type: "Independence_Day_Sale" },
          { datetime: "2018-10-20", type: "Diwali_Festival_Discount" },
          { datetime: "2018-12-20", type: "Year_End_Clearance" }
        ],
        Upcoming_promotion: [
          { datetime: "2019-02-14", type: "Valentine_Day_Promo" },
          { datetime: "2019-05-01", type: "Summer_Sale" },
          { datetime: "2019-09-28", type: "Navratri_Special" },
          { datetime: "2019-12-15", type: "Christmas_New_Year_Sale" }
        ]
      },
      historical_data: {
        Ecommerce_platform_rating: [
          { month: "2018-05", rating: 4.3 },
          { month: "2018-11", rating: 4.6 },
          { month: "2019-04", rating: 4.4 },
          { month: "2019-10", rating: 4.7 }
        ],
        Price_changes: {
          initial: 4500,
          old: [
            { datetime: "2018-03-15", price: 4200, discount: 5 },
            { datetime: "2018-10-25", price: 4500, discount: 15 }
          ],
          upcoming: [
            { datetime: "2019-05-10", price: 4300, discount: 8 },
            { datetime: "2019-12-18", price: 4600, discount: 20 }
          ]
        },
        Old_dataset_url: [
          {
            Start: "2018-01-01",
            End: "2018-12-31",
            url: "http://simulated.example.com/car_speaker_data_2018"
          },
          {
            Start: "2019-01-01",
            End: "2019-12-31",
            url: "http://simulated.example.com/car_speaker_data_2019"
          }
        ]
      },
      seasonal_trends: {
        highest_demand_months: {
          "2018": [10, 11, 12],
          "2019": [10, 11, 12]
        }
      },
      economic_indicators: {
        gdp: {
          "2018": [7.7, 7.7, 7.7, 8.0, 8.0, 8.0, 7.0, 7.0, 7.0, 6.6, 6.6, 6.6],
          "2019": [5.8, 5.8, 5.8, 5.0, 5.0, 5.0, 4.1, 4.1, 4.1, 4.7, 4.7, 4.7]
        },
        unemployment_rate: {
          "2018": [4.7, 4.7, 4.7, 4.9, 4.9, 4.9, 5.2, 5.2, 5.2, 6.9, 6.9, 6.9],
          "2019": [7.1, 7.2, 6.7, 7.6, 7.5, 7.9, 8.2, 8.2, 7.2, 7.8, 7.5, 7.6]
        },
        inflation_rate: {
          "2018": [5.24, 4.44, 4.28, 4.58, 4.87, 5.0, 4.17, 3.69, 3.7, 3.38, 2.33, 2.11],
          "2019": [2.05, 2.57, 2.86, 2.99, 3.05, 3.18, 3.15, 3.28, 3.99, 4.62, 5.54, 7.35]
        },
        consumer_confidence_index: {
          "2018": [93.7, 93.7, 93.7, 92.0, 92.0, 92.0, 93.5, 93.5, 93.5, 96.1, 96.1, 96.1],
          "2019": [97.3, 97.3, 97.3, 93.6, 93.6, 93.6, 89.4, 89.4, 89.4, 85.6, 85.6, 85.6]
        },
        interest_rate: {
          "2018": [6.0, 6.0, 6.0, 6.0, 6.25, 6.25, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5],
          "2019": [6.5, 6.25, 6.0, 5.75, 5.4, 5.4, 5.15, 5.15, 5.15, 5.15, 5.15, 5.15]
        },
        exchange_rate: {
          "2018": [63.67, 64.39, 64.97, 65.73, 67.57, 67.89, 68.74, 69.6, 72.54, 73.62, 71.97, 70.15],
          "2019": [70.92, 71.22, 69.49, 69.34, 69.8, 69.35, 68.71, 71.05, 71.02, 70.92, 71.86, 71.37]
        },
        stock_market_index: {
          "2018": [35000, 34000, 33000, 35000, 35500, 35700, 37000, 38000, 36000, 34500, 35000, 36000],
          "2019": [36000, 36500, 38000, 39000, 39500, 39600, 37000, 37500, 38500, 40000, 40500, 41000]
        }
      },
      competitor_analysis: {
        competitors: [
          {
            name: "JBL",
            market_share: 0.15,
            price: 4500,
            product_demand: {
              "2018": [15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000],
              "2019": [27000, 28000, 29000, 30000, 31000, 32000, 33000, 34000, 35000, 36000, 37000, 38000]
            }
          }
        ]
      },
      predictions: {
        accuracy: {
          "2018": 0.85,
          "2019": 0.9
        },
        promotion_effect: {
          "2018": 0.85,
          "2019": 0.9
        }
      }
    };
    
    try {
      const response = await fetch('http://localhost:5000/train_predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) throw new Error('Failed to get prediction');
      const data = await response.json();
      // The response is an array of predictions, so we can use it directly
      setPredictionData(data);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return {
    predictionData,
    isLoading,
    error,
    isModalOpen,
    getPrediction,
    closeModal,
  };
};

export default usePrediction; 