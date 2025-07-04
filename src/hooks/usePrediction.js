import { useState } from 'react';

// Helper to generate dates
const generateFallbackDates = (numDays) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < numDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]); // Use ISO format for consistency
  }
  return dates;
};

// Fallback raw predictions
const rawFallbackPredictions = 
  {
    "analysis": "json\n{\"response\":\"<div id=\\\"analysis\\\" style=\\\"font-family: Arial, sans-serif; font-size: 14px;\\\"><h2 style=\\\"color: #333; text-align: center;\\\">Sales Prediction Analysis</h2><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2018-12:</span> <span style=\\\"color: #007bff;\\\">17.11</span> - Significantly lower due to being outside the main sales period. Also, Year-End Clearance promotion started late in the month affecting the sales marginally.</div><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2019-01:</span> <span style=\\\"color: #28a745;\\\">200.63</span> - Start of the year shows initial momentum after the holiday season and increased market demand.</div><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2019-02:</span> <span style=\\\"color: #28a745;\\\">130.64</span> - Slight dip due to reduced promotional activities after January. Valentine's Day promotion helps to recover some sales.</div><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2019-03:</span> <span style=\\\"color: #28a745;\\\">159.60</span> - Gradual increase, possibly influenced by stable economic conditions and rising consumer confidence.</div><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2019-04:</span> <span style=\\\"color: #28a745;\\\">194.12</span> - Significant rise, likely boosted by improving Ecommerce platform rating and increasing market demand.</div><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2019-05:</span> <span style=\\\"color: #28a745;\\\">219.44</span> - Peak in sales due to the Summer Sale and a price drop. High consumer confidence and favorable economic indicators contribute.</div><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2019-06:</span> <span style=\\\"color: #28a745;\\\">223.59</span> - Sustained high sales from Summer Sale.</div><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2019-07:</span> <span style=\\\"color: #28a745;\\\">249.60</span> - Continued strong sales, benefiting from overall market demand and consumer spending.</div><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2019-08:</span> <span style=\\\"color: #28a745;\\\">246.68</span> - Slight decrease from July, possibly due to seasonal fluctuations.</div><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2019-09:</span> <span style=\\\"color: #28a745;\\\">220.69</span> - Navratri Special promotion at the end of the month and overall good market demand.</div><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2019-10:</span> <span style=\\\"color: #28a745;\\\">230.31</span> - Continued growth, likely driven by positive consumer confidence and a favorable Ecommerce platform rating.</div><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2019-11:</span> <span style=\\\"color: #28a745;\\\">202.85</span> - Slight dip, possibly due to anticipation of upcoming holiday season sales.</div><div style=\\\"margin-bottom: 10px;\\\"><span style=\\\"font-weight: bold;\\\">2019-12:</span> <span style=\\\"color: #28a745;\\\">212.65</span> - Strong sales performance, driven by Christmas and New Year Sale and price increases.</div><style>.highlight { background-color: yellow; }</style><script>document.addEventListener('DOMContentLoaded', function() {const months = document.querySelectorAll('#analysis div');months.forEach(month => {month.addEventListener('mouseover', function() {this.classList.add('highlight');});month.addEventListener('mouseout', function() {this.classList.remove('highlight');});});});</script></div>\"}\n",
    "end_date": "2019-12-31",
    "predictions": [
        17.11350440979004,
        14.040764093399048,
        11.894793939590455,
        10.088707122802736,
        8.873976448059084,
        7.991707022094729,
        6.815279718322756,
        6.071871468292239,
        6.053689248455813,
        6.1599642809973165,
        6.031747116783937,
        5.5683593862372085,
        5.535963162828878,
        5.616444957295574,
        5.135960111649448,
        5.38575964739451,
        5.899708601399495,
        5.792381264817106,
        5.661565763196458,
        5.375840268485634,
        5.255401390356134,
        5.496421732554683,
        5.407217246731003,
        5.292335591665808,
        5.452117317479376,
        5.642766947397807,
        6.329743571956332,
        5.860356957021853,
        5.5274053814438995,
        5.263236522867522,
        5.431043434297435,
        5.6745926286024995,
        5.136657535651775,
        4.990232133562924,
        5.026006431337644,
        4.221917844578782,
        3.659058933866151,
        3.5165637059308117,
        3.6982117115097863,
        3.9091607426514328,
        4.24274740973394,
        4.451855741813031,
        6.036700696050523,
        5.833687091111659,
        5.44279329318962,
        5.2288910256954955,
        5.010544880798096,
        5.003711211340137,
        5.429829778398282,
        5.023650934000974,
        4.658720389763646,
        4.284988272794194,
        4.042233601099735,
        4.1657784580282256,
        4.552454423832248,
        4.447961769046268,
        4.546909969283646,
        4.675894960747962,
        4.523792445649151,
        4.8752139568244965,
        4.902216987603152,
        4.892158664698,
        5.029376441188332,
        5.270087666469953,
        5.804941993680114,
        5.616539845249267,
        4.883809502427747,
        4.875147386793272,
        5.401709496501269,
        5.298895501711513,
        6.5241654583760464,
        5.7962042386490795,
        5.292349171253736,
        5.458990726163146,
        5.174721267453954,
        5.2100752088484175,
        5.796834237818481,
        5.445681768611719,
        5.590555443728486,
        4.918280040712769,
        4.391797189308497,
        4.3967368160830285,
        4.571489584854948,
        4.537954340308275,
        4.552839000963661,
        4.782811037654474,
        4.909966367049849,
        5.027333464275866,
        5.146562835416054,
        5.314373509757404,
        4.783664621251968,
        5.533152896037219,
        5.341493096248721,
        5.173708316720656,
        5.497214028864807,
        5.781708677315478,
        5.368357960147671,
        5.061081460128635,
        5.057936995037723,
        5.918695138937894,
        6.161430300908616,
        7.078056670536464,
        7.108436852542453,
        7.336738800881619,
        7.764960269831272,
        6.832191261214139,
        8.041055514464476,
        7.988618528087695,
        7.1478202623047515,
        7.360641883366751,
        6.9719786060281175,
        7.158519125972396,
        6.554821759060388,
        6.38500606981545,
        6.572201060991521,
        6.917024841102788,
        6.769520274951322,
        7.061089890920531,
        6.402559103745946,
        6.20363984281121,
        5.5678808989071715,
        5.799471402322759,
        6.548084278230277,
        6.429367366889641,
        6.690504601366938,
        6.67613929968486,
        5.8252541101885615,
        5.246849272800508,
        5.363417223416188,
        6.179618704575236,
        6.522454443182894,
        8.235595276042897,
        9.889320794808928,
        9.114053300275852,
        9.647082560264629,
        9.179704469842562,
        9.274533114753444,
        8.756214302319114,
        8.526883349051337,
        8.225821864787946,
        7.033855352548131,
        6.829390552637871,
        5.698836538789984,
        5.564196374891851,
        5.711533853911284,
        6.710773713988402,
        6.355346018157275,
        6.045740838115908,
        6.328751655630667,
        6.568958355754534,
        7.42653261325353,
        7.038937081508586,
        7.219434825271567,
        7.358318112445038,
        6.725524252376685,
        6.320873026626691,
        5.999088290991295,
        5.573778298427191,
        5.442132685128472,
        6.515955903962153,
        7.718899710047165,
        8.12441576565736,
        9.496634777748056,
        9.364868590325887,
        9.388255078864715,
        9.921011701641577,
        9.93143464360086,
        10.694254122046214,
        8.743659477923378,
        8.81876371820296,
        7.234806645071707,
        6.198703088884514,
        5.919579250435004,
        6.189647565539654,
        6.787278469607017,
        6.598235842549628,
        6.515572545499664,
        6.744505975700268,
        6.715723684673985,
        6.479618113236015,
        7.460323366321234,
        7.385118224459576,
        7.900095159401645,
        8.067799897662919,
        6.971145702737269,
        7.407460270991085,
        7.2715077866476046,
        6.931569708932342,
        6.528561412134888,
        5.368408094914057,
        6.243020161844331,
        6.048420226460329,
        7.1125994013831075,
        8.76812040703178,
        9.83810911096478,
        11.019421080886083,
        9.904377826165165,
        11.227219301947757,
        9.775822606475199,
        8.66906831009471,
        8.118684270725915,
        8.058207971848066,
        8.651493631201598,
        8.02809893480747,
        8.458178420001738,
        7.2550910624937,
        7.502137654072109,
        7.122964376645139,
        8.155274577487987,
        7.863569504061923,
        7.9229085970239534,
        8.938415569330589,
        8.469686923237909,
        8.422912738968746,
        8.748334616223826,
        8.174940848191463,
        7.9008769224801725,
        7.449359546559578,
        6.635823782648664,
        5.7108395070759626,
        6.448346135690068,
        7.0829448681467815,
        7.522162817430024,
        9.340372389564138,
        9.589901785857853,
        10.028354343420169,
        9.778782412724418,
        10.39337066437143,
        10.194451933108473,
        9.865481666726037,
        9.651421588263641,
        8.62116492716609,
        8.58857641957711,
        7.665992437541572,
        6.864206789922784,
        7.012685107383784,
        7.219117583587692,
        7.373274280035437,
        6.5439525233935845,
        6.814609860359155,
        6.840393714092988,
        7.0476393159094,
        6.262747816710675,
        6.89150051472108,
        6.740694174746835,
        7.198309238418074,
        6.562126299273278,
        6.6638319178671095,
        7.051625798881091,
        6.210589131307632,
        5.89535547939303,
        6.815843213775654,
        6.429789725286881,
        7.221943810258802,
        7.750779878834483,
        7.32117253282833,
        7.307693717790984,
        7.827423284779663,
        8.478945692643068,
        7.16466192425453,
        8.005515893468566,
        7.462363783653027,
        6.7733619245969825,
        6.740507605320897,
        7.388844110684941,
        8.362895852817973,
        8.525396447574202,
        7.806704601601843,
        7.528477446998028,
        7.254354967089389,
        6.944504462410525,
        7.979021042767776,
        7.820471835282337,
        9.456069431421671,
        8.908082645509651,
        9.321074995497078,
        8.630361583311725,
        8.356343385759487,
        8.372168824818528,
        7.120016754267055,
        6.6793995385149625,
        7.520466461561482,
        7.671389877623209,
        7.413277768950374,
        7.257557506450583,
        8.022079940707343,
        8.4470739333398,
        7.370353839283535,
        8.020537679581125,
        8.111309103320663,
        7.383876746615271,
        7.017178683058819,
        7.314894985021274,
        7.0162730780133575,
        7.070373198738811,
        7.6308468988347995,
        7.450795873865204,
        6.837891185176147,
        6.7033324908350105,
        7.169624381950236,
        6.65470823740223,
        6.069992996019197,
        6.327677136073171,
        6.184965042598771,
        6.25334560738224,
        6.425153635869171,
        6.864485472782252,
        5.679491329466342,
        5.886176529149245,
        5.658378936942443,
        4.4549729351965786,
        4.408802662274695,
        5.044463280027276,
        5.871547606138521,
        6.616652605174489,
        7.368429277132757,
        8.587771299513824,
        8.29139690640183,
        8.597662012120978,
        9.086496766679204,
        9.628173396009378,
        8.799686467661996,
        7.625330762874714,
        8.45092321778268,
        7.546316920478587,
        6.767126797643856,
        6.370425509617771,
        6.569285907114383,
        6.274204379530619,
        5.52052231328636,
        5.612580932751891,
        5.761786872208593,
        5.7666639757637,
        5.583876663246459,
        7.73014263613916,
        7.2888945921571775,
        7.793887661640781,
        6.976696099237552,
        6.3577521525986604,
        6.736993462496409,
        5.871190095467099,
        5.806220550952537,
        5.964229694698797,
        6.672455304220952,
        7.069419283354789,
        7.051910129137445,
        6.9939753269732865,
        7.541003931012224,
        8.292402067539271,
        7.992864067361496,
        7.042566009367102,
        7.120087391539092,
        5.623609190307994,
        5.249392799634091,
        5.197931426444333,
        5.589229216320262,
        6.080102435861385,
        5.822285359791403,
        6.166023211234001,
        6.962669719499897,
        7.128307906184635,
        6.617794201687211,
        7.095087755453774,
        7.429123488054426,
        9.541894981849792,
        9.570826013556006
    ],
    "start_date": "2018-12-31"
};

// Safe fallback structure
const fallbackPredictionData = {
  predictions: rawFallbackPredictions.predictions,
  dates: generateFallbackDates(rawFallbackPredictions.predictions.length),
  confidence: 90, // Optional, used for display or info
  analysis: rawFallbackPredictions.analysis,
  end_date: rawFallbackPredictions.end_date,
  start_date: rawFallbackPredictions.start_date
};

const usePrediction = (productId) => {
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPrediction = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/train_predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Prediction API response data:', data);

      const values = data.predictions || data.output || [];
      const dates = data.dates || generateFallbackDates(values.length);
      const startDate = data.start_date || rawFallbackPredictions.start_date; // Ensure start_date is always present
      const endDate = data.end_date || rawFallbackPredictions.end_date;
      const analysis = data.analysis || rawFallbackPredictions.analysis;

      const processedData = {
        predictions: values,
        dates: dates,
        start_date: startDate, // Ensure start_date is explicitly set
        analysis: data.analysis || rawFallbackPredictions.analysis,
        end_date: data.end_date || rawFallbackPredictions.end_date
      };

      const isDataEmptyOrZero = values.length === 0 || values.every(v => v === 0);
      if (isDataEmptyOrZero) {
        console.log('Using fallback data due to empty or zero predictions');
        setPredictionData(fallbackPredictionData);
      } else {
        setPredictionData(processedData);
      }

    } catch (err) {
      console.error('Error fetching prediction:', err);
      console.log('Using fallback data due to API error');
      setPredictionData(fallbackPredictionData);
      setError(`Prediction failed: ${err.message}. Using fallback data.`);
    } finally {
      setIsLoading(false);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

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
