import mongoose from 'mongoose';

const ToolSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    version: {
      type: String,
      default: 'v1.0.0',
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    size: {
      type: String,
      default: 'N/A',
    },
    link: {
      type: String,
      required: [true, 'Please provide a download link'],
    },
    iconName: {
      type: String, // String to specify which icon from lucide-react to render (e.g. 'Image', 'Palette', 'Download')
      default: 'Wrench',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Tool || mongoose.model('Tool', ToolSchema);
