# MACON Office Interface

A web-based interface for managing MACON production operations with authentication, batch management, and real-time machine monitoring.

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS (SPA)
- **Backend**: Node.js + Express API 
- **Authentication**: Supabase Auth with JWT + RBAC
- **Database**: MongoDB (Products, Batches)
- **Machine Integration**: PLC HTTP Bridge (read-only)
- **File Management**: File Bridge (read-only proxy)

## Environment Variables

### Frontend (VITE_*)
```
VITE_API_BASE=https://<public-office-api-url>
VITE_SUPABASE_URL=https://<your>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

### Backend (API)
```
PORT=8080
MONGO_URI=mongodb://<user>:<pass>@<mongo-host>:27017
MONGO_DB=MACON_Production
PLC_BRIDGE_BASE=http://<ZT-or-LAN-IP>:5001
FILE_BRIDGE_BASE=http://<ZT-or-LAN-IP>:5100
ALLOWED_ORIGIN=https://<frontend-host>
SUPABASE_JWKS=https://<your>.supabase.co/auth/v1/keys
REQUIRED_ROLE=office
```

**Note**: PLC/File bridges are LAN/ZeroTier only. Only the Office API is publicly accessible.

## API Endpoints

### Authentication
All endpoints require valid JWT Bearer token. Mutations require "office" role.

### Products
- `GET /products?q=&profile=` - List products with filters
- Returns: Products from MongoDB with regex search on Name/FileName/Profile/Data8

### Batches  
- `GET /batches` - List all batches
- `POST /batches` - Create batch (requires office role)
  - Body: `{ Data2: "batch name", Data3: "P123x2,P004x5", ... }`
- `PUT /batches/:index` - Update/upsert batch by index (requires office role)

### Machine (Read-only via PLC Bridge)
- `GET /machine/status` - Combined status from PLC symbols:
  - `MAIN.MachineState`, `MAIN.ProgressPct`, `MAIN.CurrentProduct`
  - Returns: `{ state, progressPct, currentProduct }`
- `GET /machine/events` - Machine events (placeholder, returns [])

### Files (Read-only via File Bridge)
- `GET /files/list?sub=Products` - List files/directories
- `GET /files/download?path=Products/<file.nc>` - Download file stream

### Health
- `GET /health` - Health check (returns 200 OK)

## Security

- **CORS**: Locked to specific frontend origin
- **Authentication**: Supabase JWT validation via JWKS
- **RBAC**: Only "office" role can create/modify batches
- **Network**: No direct browser access to PLC/MongoDB/Files

## Error Handling

- `401` - Not authenticated
- `403` - Insufficient permissions (no office role)
- `502` - Bridge offline (PLC/File bridge unreachable)
- `400` - Validation errors
- `500` - Server errors

## Testing

### Manual Test Plan

1. **Health Check**
   ```bash
   GET /health → 200 { ok: true }
   ```

2. **Authentication**
   ```bash
   # Without token
   GET /batches → 401
   
   # With token (user role)
   GET /batches → 200
   POST /batches → 403
   
   # With token (office role)  
   POST /batches → 200
   ```

3. **Data Operations**
   ```bash
   # Products with filters
   GET /products?q=beam&profile=IPE → filtered results
   
   # Batch creation
   POST /batches { Data2: "Test Batch", Data3: "P123x2" } → 200, appears in MongoDB
   
   # Machine status
   GET /machine/status → { state, progressPct, currentProduct }
   # If PLC bridge down → 502 bridge_down
   
   # File operations
   GET /files/list?sub=Products → file entries
   GET /files/download?path=Products/example.nc → file stream
   ```

4. **Frontend Flow**
   - Visit app → shows splash screen
   - Not logged in → redirects to login
   - Login with email/password → redirects to dashboard
   - Dashboard shows machine status from API
   - Products page shows filtered product list  
   - Batches page allows creation (if office role)
   - Progress page shows JSON dumps

## Development

```bash
# Frontend
npm run dev

# Backend  
npm run dev

# Build
npm run build
```

## Production Notes

- Set all environment variables in Lovable secrets
- Configure Supabase Site URL and Redirect URLs
- Ensure PLC/File bridges are accessible from API server via LAN/ZeroTier
- Firewall: Block direct public access to PLC/File bridges
- Office API should be the only public endpoint