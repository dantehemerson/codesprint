const { execSync } = require('child_process');

module.exports = function () {
	console.log('\nSetup Docker for testing');
	const stdout = execSync(
		'docker-compose -p docker_app_test -f docker-compose.test.yml up -d',
	);
	console.log(stdout.toString('utf-8'));
};
