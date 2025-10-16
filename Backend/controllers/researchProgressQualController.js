export const getQualData = async (req, res) => {
    try {
        // Mocked example
        res.json({
            kll: {
                target: 10,
                completed: 8,
                rows: [
                    { state: "Tamil Nadu", completed: 4 },
                    { state: "Kerala", completed: 4 },
                ],
            },
            fgd: {
                target: 5,
                completed: 3,
                rows: [
                    { state: "Tamil Nadu", completed: 2 },
                    { state: "Kerala", completed: 1 },
                ],
            },
        });
    } catch (err) {
        console.error("Error in getQualData:", err);
        res.status(500).json({ message: "Error fetching qual data" });
    }
};
