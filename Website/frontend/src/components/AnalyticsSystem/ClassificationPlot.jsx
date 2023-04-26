// Import Stuff Here!

export default function ClassificationPlot() {
  const imagePath = 'public\\sample_TSNE.png';
    return (
        <div className="analytics-system-box border">
          <div className="flex items">
              <img src={imagePath} alt="why no t-SNE??" className="max-w-full" />
              <div className="w-1/8 float-right">
                <h1>Clusters toggles go here</h1>
              </div>
          </div>
        </div>
    )
}