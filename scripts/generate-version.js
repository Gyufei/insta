const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function parseVersion(versionString) {
  const match = versionString.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!match) {
    return { major: 0, minor: 1, patch: 0, prerelease: null };
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || null,
  };
}

function incrementVersion(currentVersion, incrementType = 'patch') {
  const version = parseVersion(currentVersion);

  switch (incrementType) {
    case 'major':
      version.major += 1;
      version.minor = 0;
      version.patch = 0;
      break;
    case 'minor':
      version.minor += 1;
      version.patch = 0;
      break;
    case 'patch':
    default:
      version.patch += 1;
      break;
  }

  return `${version.major}.${version.minor}.${version.patch}`;
}

function shouldIncrementVersion(currentHash, previousVersionInfo) {
  if (!previousVersionInfo || !previousVersionInfo.fullGitHash) {
    return true; // First build or cannot get previous version info
  }

  // If git hash is different, it means there are new commits
  return currentHash !== previousVersionInfo.fullGitHash;
}

function getVersionIncrementType() {
  try {
    // Check recent commit message to decide version increment type
    const commitMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim().toLowerCase();

    if (commitMessage.includes('breaking') || commitMessage.includes('major:')) {
      return 'major';
    } else if (commitMessage.includes('feat:') || commitMessage.includes('feature:') || commitMessage.includes('minor:')) {
      return 'minor';
    } else {
      return 'patch'; // Default patch increment
    }
  } catch (error) {
    return 'patch'; // fallback to patch
  }
}

function generateVersion() {
  try {
    // Get git commit hash
    const gitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const shortHash = gitHash.substring(0, 8);

    // Get build timestamp
    const buildTimestamp = Date.now();
    const buildDate = new Date(buildTimestamp).toISOString();

    // Get version number from package.json
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    let packageVersion = packageJson.version;

    // Try to read previous version info
    const versionFilePath = path.join(__dirname, '../public/version.json');
    let previousVersionInfo = null;

    try {
      if (fs.existsSync(versionFilePath)) {
        previousVersionInfo = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
      }
    } catch (error) {
      console.log('📝 No previous version file found or invalid format, starting fresh');
    }

    // Check if version needs to be incremented
    if (shouldIncrementVersion(gitHash, previousVersionInfo)) {
      const incrementType = getVersionIncrementType();
      const newVersion = incrementVersion(packageVersion, incrementType);

      console.log(`🔄 Auto-incrementing version: ${packageVersion} → ${newVersion} (${incrementType})`);

      // Update version number in package.json
      packageJson.version = newVersion;
      fs.writeFileSync(
        path.join(__dirname, '../package.json'),
        JSON.stringify(packageJson, null, 2) + '\n'
      );

      packageVersion = newVersion;
    } else {
      console.log('📌 Using existing version:', packageVersion);
    }

    // Create version info object
    const versionInfo = {
      version: packageVersion,
      gitHash: shortHash,
      fullGitHash: gitHash,
      buildTimestamp,
      buildDate,
      buildId: `${packageVersion}-${shortHash}-${buildTimestamp}`
    };

    // Ensure public directory exists
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write version file to public directory
    fs.writeFileSync(versionFilePath, JSON.stringify(versionInfo, null, 2));

    console.log('✅ Version file generated:', versionInfo.buildId);
    console.log('📄 Version file path:', versionFilePath);

    return versionInfo;
  } catch (error) {
    console.error('❌ Error generating version file:', error.message);

    // Generate fallback version info
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    const fallbackTimestamp = Date.now();
    const fallbackVersion = {
      version: packageJson.version || '0.1.0',
      gitHash: 'unknown',
      fullGitHash: 'unknown',
      buildTimestamp: fallbackTimestamp,
      buildDate: new Date(fallbackTimestamp).toISOString(),
      buildId: `${packageJson.version || '0.1.0'}-unknown-${fallbackTimestamp}`
    };

    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const fallbackVersionFilePath = path.join(publicDir, 'version.json');
    fs.writeFileSync(fallbackVersionFilePath, JSON.stringify(fallbackVersion, null, 2));

    console.log('⚠️  Generated fallback version file');
    return fallbackVersion;
  }
}

// If running this script directly
if (require.main === module) {
  generateVersion();
}

module.exports = { generateVersion };