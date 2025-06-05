import { useState, useEffect } from "react";

export const useService = (serviceId) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/services/${serviceId}`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Service not found"
              : "Failed to fetch service",
          );
        }

        const serviceData = await response.json();
        setService(serviceData);

        // Prepare images
        const processedImages =
          serviceData.gallery?.map((img) => ({
            src: img.url,
            alt: serviceData.title,
          })) || [];

        setImages(processedImages);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  return { service, loading, error, images };
};

export default useService;
