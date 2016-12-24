module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('city_council', [
      {
        state: 'OR',
        city: 'Portland',
        district_number: 1,
        representative: 'Shirley Craddick',
        title: 'council_member',
        party: 'nonpartisan',
        email: 'shirley.craddick@oregonmetro.gov',
        phone: '503-797-1547',
        twitter_url: null,
        facebook_url: 'https://www.facebook.com/shirley.craddick',
        photo_url: 'https://civil-services.s3.amazonaws.com/city-council/or/portland/shirley-craddick.jpg',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        state: 'OR',
        city: 'Portland',
        district_number: 2,
        representative: 'Carlotta Collette',
        title: 'council_member',
        party: 'nonpartisan',
        email: 'carlotta.collette@oregonmetro.gov',
        phone: '503-797-1887',
        twitter_url: 'https://twitter.com/CarlottaCollett',
        facebook_url: 'https://www.facebook.com/carlotta.collette',
        photo_url: 'https://civil-services.s3.amazonaws.com/city-council/or/portland/carlotta-collette.jpg',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        state: 'OR',
        city: 'Portland',
        district_number: 3,
        representative: 'Craig Dirksen',
        title: 'council_member',
        party: 'nonpartisan',
        email: 'craig.dirksen@oregonmetro.gov',
        phone: '503-797-1549',
        twitter_url: null,
        facebook_url: 'https://www.facebook.com/craig.dirksen.3',
        photo_url: 'https://civil-services.s3.amazonaws.com/city-council/or/portland/craig-dirksen.jpg',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        state: 'OR',
        city: 'Portland',
        district_number: 4,
        representative: 'Kathryn Harrington',
        title: 'council_member',
        party: 'nonpartisan',
        email: 'kathryn.harrington@oregonmetro.gov',
        phone: '503-797-1553',
        twitter_url: null,
        facebook_url: 'https://www.facebook.com/kathryn.harrington.10',
        photo_url: 'https://civil-services.s3.amazonaws.com/city-council/or/portland/kathryn-harrington.jpg',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        state: 'OR',
        city: 'Portland',
        district_number: 5,
        representative: 'Sam Chase',
        title: 'council_member',
        party: 'nonpartisan',
        email: 'sam.chase@oregonmetro.gov',
        phone: '503-797-1939',
        twitter_url: null,
        facebook_url: 'https://www.facebook.com/SamChaseOregon',
        photo_url: 'https://civil-services.s3.amazonaws.com/city-council/or/portland/sam-chase.jpg',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        state: 'OR',
        city: 'Portland',
        district_number: 6,
        representative: 'Bob Stacey',
        title: 'council_member',
        party: 'nonpartisan',
        email: 'bob.stacey@oregonmetro.gov',
        phone: '503-797-1546',
        twitter_url: null,
        facebook_url: 'https://www.facebook.com/BobStaceyMetro',
        photo_url: 'https://civil-services.s3.amazonaws.com/city-council/or/portland/bob-stacey.jpg',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        state: 'OR',
        city: 'Portland',
        district_number: null,
        representative: 'Charlie Hales',
        title: 'mayor',
        party: 'democrat',
        email: 'mayorcharliehales@portlandoregon.gov',
        phone: '503-823-4120',
        twitter_url: 'https://twitter.com/MayorPDX',
        facebook_url: 'https://www.facebook.com/PDXMayor.charlie.hales',
        photo_url: 'https://civil-services.s3.amazonaws.com/city-council/or/portland/charlie-hales.jpg',
        created_date: new Date(),
        modified_date: new Date()
      },
      {
        state: 'OR',
        city: 'Portland',
        district_number: null,
        representative: 'Rod Underhill',
        title: 'district_attorney',
        party: 'nonpartisan',
        email: 'DA@mcda.us',
        phone: '503-988-3162',
        twitter_url: null,
        facebook_url: null,
        photo_url: 'https://civil-services.s3.amazonaws.com/city-council/or/portland/rod-underhill.jpg',
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['state', 'city', 'district_number', 'title']
    });
  },

  down: function (queryInterface) {
    return queryInterface.bulkDelete('city_council', null, {});
  }
};
