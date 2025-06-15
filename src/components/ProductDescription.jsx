
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Trash2, Upload, Download, Package, Tag, DollarSign, Warehouse, Scale, Ruler, Building } from 'lucide-react';

const ProductDescription = ({ product, user, handleDatasetUpload, datasetInputRef, datasetUploading, datasetError, datasetSuccess, handleDelete }) => {
  const navigate = useNavigate();

  const infoItems = [
    { icon: Tag, label: "Category", value: product.category, show: true },
    { icon: Package, label: "Sub Category", value: product.subCategory, show: !!product.subCategory },
    { icon: DollarSign, label: "Price", value: `$${product.price}`, show: true },
    { icon: Warehouse, label: "Stock", value: `${product.stock} units`, show: true },
    { icon: Building, label: "Brand", value: product.brand, show: !!product.brand },
    { icon: Tag, label: "SKU", value: product.sku, show: !!product.sku },
    { icon: Scale, label: "Weight", value: `${product.weight} kg`, show: !!product.weight },
    { icon: Ruler, label: "Dimensions", value: product.dimensions, show: !!product.dimensions }
  ];

  return (
    <div className="min-h-screen  from-background ">
      <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
        {/* Header with Glass Effect */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/20 p-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary via-primary to-foreground bg-clip-text text-transparent tracking-tight">
                {product.product_name}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full"></div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/products/${product._id}/edit`)}
                className="group relative px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 font-medium overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <Edit3 size={18} />
                  Edit
                </span>
              </button>
              <button
                onClick={handleDelete}
                className="group relative px-6 py-3 bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 font-medium overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-destructive/80 to-destructive/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <Trash2 size={18} />
                  Delete
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Info Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
          {infoItems.filter(item => item.show).map((item, index) => (
            <div 
              key={index}
              className="group bg-card/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-border/30 hover:shadow-xl hover:bg-card/80 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-300">
                  <item.icon className="text-primary group-hover:text-accent transition-colors duration-300" size={20} />
                </div>
                <h2 className="font-semibold text-foreground group-hover:text-foreground/90 transition-colors duration-300">
                  {item.label}
                </h2>
              </div>
              <p className="text-muted-foreground group-hover:text-foreground/70 font-medium ml-11 transition-colors duration-300">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Description Section */}
        <div className="bg-card/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-border/30 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-lg">
              <Package className="text-accent" size={24} />
            </div>
            <h2 className="font-bold text-foreground text-xl">Product Description</h2>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-accent to-primary rounded-full mb-4"></div>
          <p className="text-foreground/80 leading-relaxed text-lg font-medium">
            {product.description}
          </p>
        </div>

        {/* Admin Actions with Premium Design */}
        
          <div className="bg-gradient-to-br from-card/80 to-secondary/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/30 overflow-hidden">
            <div className="bg-gradient-to-r from-primary via-accent to-primary/80 p-8 text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-foreground/20 rounded-xl backdrop-blur-sm">
                  <Upload className="text-primary-foreground" size={28} />
                </div>
                <h2 className="text-2xl font-bold">Dataset Operations</h2>
              </div>
            </div>
            
            <div className="p-8">
              <div className="bg-gradient-to-br from-secondary/50 to-accent/50 p-8 rounded-xl border border-border/50 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                    <Upload className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Upload Dataset for Predictions
                  </h3>
                </div>
                
                <form onSubmit={handleDatasetUpload} className="space-y-4">
                  <div className="relative">
                    <input
                      type="file"
                      ref={datasetInputRef}
                      className="block w-full text-sm text-foreground file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:font-semibold file:bg-gradient-to-r file:from-primary file:to-accent file:text-primary-foreground hover:file:from-primary/80 hover:file:to-accent/80 file:shadow-lg file:transition-all file:duration-300 cursor-pointer border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors duration-300 bg-card/60"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="group relative w-full bg-gradient-to-r from-primary via-accent to-primary/80 text-primary-foreground py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                    disabled={datasetUploading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-accent/80 to-primary/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Upload size={20} />
                      {datasetUploading ? 'Uploading Dataset...' : 'Upload Dataset'}
                    </span>
                  </button>
                  
                  {datasetError && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                      <p className="text-destructive font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-destructive rounded-full"></span>
                        {datasetError}
                      </p>
                    </div>
                  )}
                  
                  {datasetSuccess && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <p className="text-green-600 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {datasetSuccess}
                      </p>
                    </div>
                  )}
                </form>
                
                {product.datasetUrl && (
                  <div className="mt-6 bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-gradient-to-br from-green-500/10 to-accent/10 rounded-lg">
                          <Package className="text-green-600" size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-foreground block">Uploaded Dataset:</span>
                          <a
                            href={product.datasetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-accent font-medium hover:underline transition-colors duration-200 truncate block"
                          >
                            {product.datasetUrl.split('/').pop()}
                          </a>
                        </div>
                      </div>
                      <a
                        href={product.datasetUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 group relative px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center gap-2">
                          <Download size={18} />
                          Download
                        </span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
      
      </div>
    </div>
  );
};

export default ProductDescription;
