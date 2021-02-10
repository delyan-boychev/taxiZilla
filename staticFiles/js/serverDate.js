const fetchSampleImplementation = async () => {
  const requestDate = new Date();

  const { headers, ok, statusText } = await fetch(window.location, {
    cache: `no-store`,
    method: `HEAD`,
  });

  if (!ok) {
    throw new Error(`Bad date sample from server: ${statusText}`);
  }

  return {
    requestDate,
    responseDate: new Date(),
    serverDate: new Date(headers.get(`Date`)),
  };
};

const getServerDate = async (
  { fetchSample } = { fetchSample: fetchSampleImplementation }
) => {
  let best = { uncertainty: Number.MAX_VALUE };
    try {
      const { requestDate, responseDate, serverDate } = await fetchSample();
      const uncertainty = (responseDate - requestDate) / 2 + 500;

      if (uncertainty < best.uncertainty) {
        const date = new Date(serverDate.getTime() + 500);

        best = {
          date,
          offset: date - responseDate,
          uncertainty,
        };
      }
    } catch (exception) {
      console.warn(exception);
    }

  return best;
};
