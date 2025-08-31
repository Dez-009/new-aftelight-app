# Avatar System for AfterLight Personas

## Overview
The Avatar System allows users to upload, edit, and manage profile images for their personas. It provides a seamless way to personalize memorial profiles with visual representation.

## Features

### 🖼️ **Avatar Display**
- **Circular avatar images** with fallback to initials
- **Multiple sizes**: sm (48px), md (64px), lg (96px), xl (128px)
- **Responsive design** that works across all device sizes
- **Fallback system** shows user initials when no image is available

### ✏️ **Avatar Management**
- **Upload new images** by clicking on the avatar or upload button
- **Remove existing avatars** with the remove button
- **Edit avatars** directly from persona cards
- **Real-time updates** with immediate visual feedback

### 🔒 **Access Control**
- **Tier-based editing**: Only active personas can have avatars edited
- **Disabled state**: Locked personas (tier limit exceeded) cannot edit avatars
- **Permission validation**: Ensures users can only edit their own personas

## Technical Implementation

### Database Schema
```sql
-- Added to personas table
ALTER TABLE personas ADD COLUMN avatar_url VARCHAR(500);
ALTER TABLE personas ADD COLUMN avatar_updated_at TIMESTAMP WITH TIME ZONE;

-- Index for performance
CREATE INDEX idx_personas_avatar_url ON personas(avatar_url) WHERE avatar_url IS NOT NULL;
```

### Components

#### `Avatar.tsx` - Core Avatar Component
- **Props**: `src`, `alt`, `size`, `editable`, `onAvatarChange`, `disabled`
- **Features**: Image display, upload overlay, action buttons, fallback initials
- **States**: Hover, uploading, disabled, error

#### `avatarService.ts` - Avatar Management Service
- **Upload handling**: File validation, processing, and storage
- **Database operations**: Update and remove avatar URLs
- **Image processing**: Client-side cropping and resizing
- **Error handling**: Comprehensive error management

### API Endpoints

#### `PATCH /api/personas/[id]/avatar`
- Updates persona avatar URL
- Accepts: `{ avatarUrl: string | null }`
- Returns: Success status and updated URL

#### `GET /api/personas/[id]/avatar`
- Retrieves avatar metadata
- Returns: File information and upload details

## Usage Examples

### Basic Avatar Display
```tsx
<Avatar 
  src={persona.avatarUrl} 
  alt={persona.name} 
  size="md" 
/>
```

### Editable Avatar with Upload
```tsx
<Avatar
  src={persona.avatarUrl}
  alt={persona.name}
  size="lg"
  editable={true}
  onAvatarChange={(file) => handleAvatarChange(persona.id, file)}
/>
```

### Disabled Avatar (Tier Limit Exceeded)
```tsx
<Avatar
  src={persona.avatarUrl}
  alt={persona.name}
  size="lg"
  editable={true}
  disabled={exceedsLimit}
  onAvatarChange={(file) => handleAvatarChange(persona.id, file)}
/>
```

## File Requirements

### Supported Formats
- **Image types**: JPEG, PNG, GIF, WebP
- **File size**: Maximum 5MB
- **Dimensions**: Automatically cropped to square format

### Image Processing
- **Automatic cropping**: Centers and squares images
- **Resizing**: Optimizes for avatar display (300x300px)
- **Format conversion**: Converts to JPEG for consistency

## Integration Points

### Persona Cards
- Avatars are displayed in the header section of each persona card
- Positioned to the left of persona name and relationship
- Responsive layout that works with existing card design

### State Management
- Avatar changes update local persona state immediately
- Database updates happen asynchronously
- Error handling provides user feedback

### Tier System Integration
- Avatars respect the same tier limits as other persona features
- Disabled personas cannot edit avatars
- Visual indicators show when avatars are locked

## Future Enhancements

### Planned Features
- **AI-generated avatars** based on persona characteristics
- **Avatar templates** for different cultural backgrounds
- **Batch avatar operations** for multiple personas
- **Avatar history** with version control

### Technical Improvements
- **Real-time sync** across multiple devices
- **Advanced image processing** with filters and effects
- **CDN integration** for faster image delivery
- **Progressive image loading** for better performance

## Security Considerations

### File Validation
- **Type checking**: Only image files accepted
- **Size limits**: Prevents large file uploads
- **Content validation**: Ensures uploaded files are valid images

### Access Control
- **User permissions**: Only persona owners can edit avatars
- **Tier enforcement**: Respects subscription limits
- **Input sanitization**: Prevents malicious file uploads

## Performance Optimizations

### Image Optimization
- **Client-side processing**: Reduces server load
- **Lazy loading**: Images load only when needed
- **Caching**: Browser caching for avatar images
- **Compression**: Optimized file sizes for web

### Database Performance
- **Indexed queries**: Fast avatar lookups
- **Efficient updates**: Minimal database operations
- **Connection pooling**: Optimized database connections

## Troubleshooting

### Common Issues
1. **Image not uploading**: Check file size and format
2. **Avatar not displaying**: Verify image URL accessibility
3. **Edit buttons disabled**: Check tier limits and permissions
4. **Upload errors**: Validate file type and size

### Debug Information
- Console logs show upload progress and errors
- Network tab displays API call details
- Avatar service provides detailed error messages

## Testing

### Manual Testing
- Upload various image formats and sizes
- Test avatar editing with different tier levels
- Verify fallback behavior with invalid images
- Check responsive design across devices

### Automated Testing
- Unit tests for avatar component
- Integration tests for avatar service
- API endpoint testing
- Accessibility testing for screen readers
