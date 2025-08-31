# AfterLight Downgrade System

## Overview

The AfterLight downgrade system handles subscription tier changes while preserving user data and providing flexible business rule options. This system implements three strategies for managing excess personas when users downgrade from higher tiers.

## Business Rules

### Current Problem
- User has 5 personas on Premium tier
- Downgrades to Free tier (1 persona limit)
- What happens to the extra 4 personas?

### Business Logic Options

#### 1. Soft Limit (Recommended)
- **Action**: Keep existing personas but prevent new creation
- **Implementation**: Lock excess personas to read-only mode
- **Benefits**:
  - No data loss
  - Users can still access memories
  - Easy to restore with upgrade
  - Better user experience
- **Drawbacks**:
  - Storage costs continue
  - May encourage upgrade avoidance

#### 2. Hard Limit
- **Action**: Force deletion of excess personas
- **Implementation**: Delete excess personas permanently
- **Benefits**:
  - Immediate cost reduction
  - Clear tier boundaries
  - Forces upgrade decisions
- **Drawbacks**:
  - Permanent data loss
  - Poor user experience
  - Potential legal issues
  - Negative brand impact

#### 3. Grace Period
- **Action**: Allow temporary access with upgrade prompts
- **Implementation**: Provide 30-day grace period with warnings
- **Benefits**:
  - User-friendly transition
  - Time to make decisions
  - Reduces churn risk
- **Drawbacks**:
  - Extended storage costs
  - Complex implementation
  - May delay upgrade decisions

## Architecture

### Database Schema Changes

```sql
-- New fields added to personas table
ALTER TABLE personas 
ADD COLUMN access_status VARCHAR(50) DEFAULT 'active',
ADD COLUMN locked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN locked_reason VARCHAR(255),
ADD COLUMN priority_order INTEGER DEFAULT 0;
```

**Field Descriptions:**
- `access_status`: Controls persona access ('active', 'locked', 'grace_period', 'archived')
- `locked_at`: Timestamp when persona was locked
- `locked_reason`: Reason for locking ('downgrade', 'admin_action', 'payment_issue')
- `priority_order`: Determines which personas to keep active during downgrades

### Database Functions

#### `lock_personas_for_downgrade()`
Handles persona locking based on selected strategy.

#### `restore_personas_after_upgrade()`
Restores locked personas when user upgrades.

#### `get_persona_access_summary()`
Provides summary of persona access status for a user.

### Views

#### `persona_status_view`
Easy access to persona status and permissions.

## Implementation

### Core Services

#### 1. SubscriptionRulesService (`lib/subscriptionRules.ts`)
- Manages tier configurations and limits
- Calculates downgrade impact
- Provides strategy information
- Generates SQL for database operations

#### 2. DowngradeService (`lib/downgradeService.ts`)
- Executes downgrade operations
- Manages persona access control
- Handles grace period cleanup
- Provides validation and error handling

### Components

#### DowngradeHandler (`components/personas/DowngradeHandler.tsx`)
Enhanced component that:
- Shows strategy selection options
- Displays impact analysis
- Provides strategy comparison
- Handles user confirmation

## Usage Examples

### Basic Downgrade Flow

```typescript
import { SubscriptionRulesService } from '@/lib/subscriptionRules'
import { DowngradeService } from '@/lib/downgradeService'

// Calculate impact
const impact = SubscriptionRulesService.calculateDowngradeImpact(
  'premium',
  'free',
  userPersonas,
  currentStorageUsage
)

// Execute downgrade
const result = await DowngradeService.executeDowngrade({
  userId: 'user-123',
  currentTier: 'premium',
  newTier: 'free',
  strategy: 'soft',
  personasToLock: impact.personasToLock.map(p => p.id),
  personasToKeep: impact.personasToKeep.map(p => p.id),
  storageImpact: impact.storageImpact,
  timestamp: new Date(),
  status: 'pending'
})
```

### Restore After Upgrade

```typescript
const restoreResult = await DowngradeService.restorePersonasAfterUpgrade('user-123')
console.log(`Restored ${restoreResult.restoredCount} personas`)
```

### Access Control Check

```typescript
const accessControl = await DowngradeService.getPersonaAccessControl(
  'persona-123',
  'free',
  true // isWithinLimit
)

if (accessControl.canEdit) {
  // Allow editing
} else {
  // Show locked message
}
```

## Configuration

### Tier Limits

```typescript
const TIERS = {
  free: { maxPersonas: 1, maxStorageMB: 100 },
  premium: { maxPersonas: 5, maxStorageMB: 1000 },
  religious: { maxPersonas: 25, maxStorageMB: 5000 },
  healthcare: { maxPersonas: 50, maxStorageMB: 10000 }
}
```

### Strategy Configuration

Each strategy can be customized with:
- Lock duration (for grace period)
- Warning thresholds
- Cleanup schedules
- User notification preferences

## Maintenance

### Grace Period Cleanup

Run daily to lock expired grace period personas:

```typescript
// Via cron job or scheduled task
const cleanupResult = await DowngradeService.cleanupExpiredGracePeriods()
console.log(`Processed ${cleanupResult.processedCount} expired personas`)
```

### Monitoring

Track downgrade operations:
- Success/failure rates
- Strategy preferences
- User retention impact
- Storage cost implications

## Security Considerations

### Access Control
- Validate user permissions before operations
- Audit all downgrade actions
- Prevent unauthorized access to locked personas

### Data Protection
- Backup personas before hard deletion
- Encrypt sensitive persona data
- Implement proper authentication

## Future Enhancements

### Planned Features
1. **Smart Priority Ordering**: AI-powered persona prioritization
2. **Flexible Grace Periods**: User-configurable grace period lengths
3. **Bulk Operations**: Handle multiple users simultaneously
4. **Analytics Dashboard**: Track downgrade patterns and business impact

### Integration Points
1. **Payment Systems**: Automatic downgrade triggers
2. **Notification System**: Email/SMS alerts for grace periods
3. **Admin Panel**: Manual override capabilities
4. **API Endpoints**: External system integration

## Testing

### Test Scenarios
1. **Soft Downgrade**: Verify personas become read-only
2. **Hard Downgrade**: Confirm permanent deletion
3. **Grace Period**: Test expiration handling
4. **Upgrade Restoration**: Verify persona reactivation
5. **Edge Cases**: Handle concurrent operations

### Test Data
Use realistic persona counts and storage usage to validate business logic.

## Deployment

### Database Migration
1. Run `schema.sql` for new installations
2. Run `downgrade_migration.sql` for existing databases
3. Verify indexes and functions are created

### Environment Variables
```bash
# Downgrade strategy defaults
DEFAULT_DOWNGRADE_STRATEGY=soft
GRACE_PERIOD_DAYS=30
CLEANUP_SCHEDULE=daily
```

## Support

### Common Issues
1. **Personas not locking**: Check database permissions
2. **Grace period not expiring**: Verify cleanup job is running
3. **Restore failures**: Check persona status consistency

### Troubleshooting
- Enable debug logging for detailed operation tracking
- Check database function execution logs
- Verify user permissions and data integrity

---

**Note**: This system is designed to be flexible and user-friendly while maintaining business objectives. The soft limit strategy is recommended for most use cases to preserve user experience and data integrity.
