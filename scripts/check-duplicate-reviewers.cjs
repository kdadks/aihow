// Script to check for duplicate reviewer names and photos in reviews and testimonials
const fs = require('fs');
const path = require('path');

// Read and parse the TypeScript file
const communityFile = fs.readFileSync(path.join(__dirname, '../src/data/community.ts'), 'utf8');

// Extract reviews array
const reviewsMatch = communityFile.match(/export const reviews = \[([\s\S]*?)\];/);
const testimonialsMatch = communityFile.match(/export const testimonials = \[([\s\S]*?)\];/);

if (!reviewsMatch || !testimonialsMatch) {
  console.error('Could not parse reviews or testimonials from community.ts');
  process.exit(1);
}

// Simple evaluation (this is for analysis purposes only)
const reviews = eval(`[${reviewsMatch[1]}]`);
const testimonials = eval(`[${testimonialsMatch[1]}]`);

console.log('=== DUPLICATE ANALYSIS FOR REVIEWS AND TESTIMONIALS ===\n');

// Check for duplicate names in reviews
console.log('📝 REVIEWS ANALYSIS:');
console.log(`Total reviews: ${reviews.length}\n`);

const reviewNames = {};
const reviewPhotos = {};

reviews.forEach((review, index) => {
  // Track names
  if (reviewNames[review.name]) {
    reviewNames[review.name].push(index);
  } else {
    reviewNames[review.name] = [index];
  }
  
  // Track photos (only if photoUrl exists)
  if (review.photoUrl) {
    if (reviewPhotos[review.photoUrl]) {
      reviewPhotos[review.photoUrl].push(index);
    } else {
      reviewPhotos[review.photoUrl] = [index];
    }
  }
});

// Report duplicate names in reviews
console.log('🔍 Duplicate Names in Reviews:');
let reviewNameDuplicates = false;
Object.entries(reviewNames).forEach(([name, indices]) => {
  if (indices.length > 1) {
    console.log(`  ❌ "${name}" appears ${indices.length} times (indices: ${indices.join(', ')})`);
    reviewNameDuplicates = true;
  }
});
if (!reviewNameDuplicates) {
  console.log('  ✅ No duplicate names found');
}

// Report duplicate photos in reviews
console.log('\n📸 Duplicate Photos in Reviews:');
let reviewPhotoDuplicates = false;
Object.entries(reviewPhotos).forEach(([photo, indices]) => {
  if (indices.length > 1) {
    console.log(`  ❌ Photo "${photo}" used ${indices.length} times (indices: ${indices.join(', ')})`);
    indices.forEach(index => {
      console.log(`    - Review ${index}: ${reviews[index].name}`);
    });
    reviewPhotoDuplicates = true;
  }
});
if (!reviewPhotoDuplicates) {
  console.log('  ✅ No duplicate photos found');
}

// Check for duplicate names in testimonials
console.log('\n\n💬 TESTIMONIALS ANALYSIS:');
console.log(`Total testimonials: ${testimonials.length}\n`);

const testimonialNames = {};
const testimonialPhotos = {};

testimonials.forEach((testimonial, index) => {
  // Track names
  if (testimonialNames[testimonial.name]) {
    testimonialNames[testimonial.name].push(index);
  } else {
    testimonialNames[testimonial.name] = [index];
  }
  
  // Track photos
  if (testimonialPhotos[testimonial.image]) {
    testimonialPhotos[testimonial.image].push(index);
  } else {
    testimonialPhotos[testimonial.image] = [index];
  }
});

// Report duplicate names in testimonials
console.log('🔍 Duplicate Names in Testimonials:');
let testimonialNameDuplicates = false;
Object.entries(testimonialNames).forEach(([name, indices]) => {
  if (indices.length > 1) {
    console.log(`  ❌ "${name}" appears ${indices.length} times (indices: ${indices.join(', ')})`);
    testimonialNameDuplicates = true;
  }
});
if (!testimonialNameDuplicates) {
  console.log('  ✅ No duplicate names found');
}

// Report duplicate photos in testimonials
console.log('\n📸 Duplicate Photos in Testimonials:');
let testimonialPhotoDuplicates = false;
Object.entries(testimonialPhotos).forEach(([photo, indices]) => {
  if (indices.length > 1) {
    console.log(`  ❌ Photo "${photo}" used ${indices.length} times (indices: ${indices.join(', ')})`);
    indices.forEach(index => {
      console.log(`    - Testimonial ${index}: ${testimonials[index].name} (${testimonials[index].company})`);
    });
    testimonialPhotoDuplicates = true;
  }
});
if (!testimonialPhotoDuplicates) {
  console.log('  ✅ No duplicate photos found');
}

// Cross-check between reviews and testimonials
console.log('\n\n🔄 CROSS-ANALYSIS (Reviews vs Testimonials):');
const allNames = new Set();
const allPhotos = new Set();
let crossNameDuplicates = false;
let crossPhotoDuplicates = false;

console.log('🔍 Names appearing in both Reviews and Testimonials:');
reviews.forEach(review => {
  if (testimonialNames[review.name]) {
    console.log(`  ❌ "${review.name}" appears in both reviews and testimonials`);
    crossNameDuplicates = true;
  }
});
if (!crossNameDuplicates) {
  console.log('  ✅ No names appear in both sections');
}

console.log('\n📸 Photos used in both Reviews and Testimonials:');
reviews.forEach((review, rIndex) => {
  if (review.photoUrl) {
    testimonials.forEach((testimonial, tIndex) => {
      if (review.photoUrl === testimonial.image) {
        console.log(`  ❌ Photo "${review.photoUrl}" used in both:`);
        console.log(`    - Review ${rIndex}: ${review.name}`);
        console.log(`    - Testimonial ${tIndex}: ${testimonial.name} (${testimonial.company})`);
        crossPhotoDuplicates = true;
      }
    });
  }
});
if (!crossPhotoDuplicates) {
  console.log('  ✅ No photos appear in both sections');
}

console.log('\n=== SUMMARY ===');
const issues = [];
if (reviewNameDuplicates) issues.push('Duplicate names in reviews');
if (reviewPhotoDuplicates) issues.push('Duplicate photos in reviews');
if (testimonialNameDuplicates) issues.push('Duplicate names in testimonials');
if (testimonialPhotoDuplicates) issues.push('Duplicate photos in testimonials');
if (crossNameDuplicates) issues.push('Names appearing in both sections');
if (crossPhotoDuplicates) issues.push('Photos appearing in both sections');

if (issues.length > 0) {
  console.log(`❌ Found ${issues.length} issue(s):`);
  issues.forEach(issue => console.log(`  - ${issue}`));
} else {
  console.log('✅ No duplicate issues found!');
}